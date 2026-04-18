// pages/public/AgentHub.jsx
// Protected — requires BargainerProtectedRoute

import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useBargainerAuth } from "../../context/BargainerAuthContext";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Navigation, LogOut, Star, MessageCircle,
  Users, FileText, Loader2, X, ChevronRight,
  Locate, Wifi, WifiOff, AlertCircle, CheckCircle2,
  Building2, Phone
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const IMG_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, toR = d => (d * Math.PI) / 180;
  const a = Math.sin(toR(lat2 - lat1) / 2) ** 2 +
    Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(toR(lng2 - lng1) / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const userIcon = new L.DivIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 3px rgba(59,130,246,0.35)"></div>`,
  className: "", iconSize: [16, 16], iconAnchor: [8, 8],
});

const makeAgentIcon = (agent, isClosest) => {
  const size = isClosest ? 46 : 38;
  const ring = isClosest ? "3px solid #16a34a" : "2px solid #fff";
  const shadow = isClosest
    ? "box-shadow:0 0 0 3px rgba(22,163,74,0.4),0 4px 12px rgba(0,0,0,0.25)"
    : "box-shadow:0 2px 8px rgba(0,0,0,0.2)";
  const inner = agent.pfp
    ? `<img src="${IMG_BASE}/${agent.pfp}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" />`
    : `<span style="color:#fff;font-size:${isClosest ? 18 : 15}px;font-weight:bold;line-height:1">${agent.fullName?.[0] || "A"}</span>`;
  const bg = agent.pfp ? "transparent" : (isClosest ? "#16a34a" : "#f59e0b");
  return new L.DivIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:${ring};${shadow};display:flex;align-items:center;justify-content:center;overflow:hidden;">${inner}</div>`,
    className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2],
  });
};

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, zoom || 13, { duration: 1.2 }); }, [center]);
  return null;
}

// ── Star display ─────────────────────────────────────────────────────
function Stars({ rating, count, size = "sm" }) {
  const sz = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`${sz} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
      <span className="text-[10px] text-gray-400 ml-0.5">({count})</span>
    </div>
  );
}

// ── Location Permission Modal ─────────────────────────────────────────
function LocationModal({ onAllow, onDismiss, error, loading }) {
  return (
    <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>

        {/* Visual header */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 px-6 pt-8 pb-10 text-white text-center relative">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
          </div>
          <h2 className="text-xl font-black leading-tight mb-1">لوکیشن کی اجازت</h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            قریب ترین ایجنٹ تلاش کرنے کے لیے آپ کی موجودہ جگہ معلوم ہونی ضروری ہے
          </p>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5" />
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            {[
              { icon: <Navigation className="w-4 h-4 text-emerald-600" />, text: "قریب ترین ایجنٹ کا فاصلہ ناپنا" },
              { icon: <MapPin className="w-4 h-4 text-emerald-600" />,     text: "نقشے پر آپ کی پوزیشن دکھانا" },
              { icon: <MessageCircle className="w-4 h-4 text-emerald-600" />, text: "WhatsApp پر لوکیشن شیئر کرنا" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                {item.text}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-3.5 py-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          <button
            onClick={onAllow}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-70">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Locate className="w-4 h-4" />
            )}
            {loading ? "لوکیشن تلاش ہو رہی ہے..." : "لوکیشن کی اجازت دیں"}
          </button>

          <button onClick={onDismiss}
            className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ابھی نہیں — بغیر لوکیشن جاری رکھیں
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(60px); opacity:0 } to { transform: translateY(0); opacity:1 } }`}</style>
    </div>
  );
}

// ── Agent Bottom Sheet ────────────────────────────────────────────────
function AgentSheet({ agent, distKm, userPos, onClose, onRate, ratingGiven }) {
  if (!agent) return null;
  const eta = distKm != null ? Math.ceil((distKm / 30) * 60) : null;

  const openWhatsApp = () => {
    const wa  = agent.whatsapp?.replace(/\D/g, "");
    const loc = userPos ? `https://www.google.com/maps?q=${userPos.lat},${userPos.lng}` : "";
    const msg = encodeURIComponent(
      `السلام علیکم ${agent.fullName}! مجھے اقرار نامہ کی ضرورت ہے۔${loc ? ` میری لوکیشن: ${loc}` : ""}`
    );
    if (wa) window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
    else alert("This agent has not provided a WhatsApp number.");
  };

  return (
    <>
      <div className="fixed inset-0 z-[400] bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[500] bg-white rounded-t-3xl shadow-2xl max-w-lg mx-auto"
        style={{ animation: "slideUp 0.25s ease" }}>

        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="px-5 pt-2 pb-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
              {agent.pfp ? (
                <img src={`${IMG_BASE}/${agent.pfp}`} alt={agent.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl">
                  {agent.fullName?.[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-gray-900 text-base leading-tight">{agent.fullName}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  agent.status === "online" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "online" ? "bg-green-500" : "bg-amber-500"}`} />
                  {agent.status === "online" ? "Online" : "Busy"}
                </span>
              </div>
              <Stars rating={agent.rating} count={agent.ratingCount} />
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-400 truncate">{agent.officeAddress || "—"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center mb-0.5">
                <FileText className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-base font-black text-gray-900">{agent.totalContracts}</p>
              <p className="text-[10px] text-gray-400">معاہدے</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center mb-0.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-base font-black text-gray-900">{agent.rating.toFixed(1)}</p>
              <p className="text-[10px] text-gray-400">ریٹنگ</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center mb-0.5">
                <Navigation className="w-4 h-4 text-blue-400" />
              </div>
              {distKm != null ? (
                <>
                  <p className="text-base font-black text-blue-600">
                    {distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`}
                  </p>
                  <p className="text-[10px] text-gray-400">{eta ? `~${eta} min` : "فاصلہ"}</p>
                </>
              ) : (
                <>
                  <p className="text-base font-black text-gray-400">—</p>
                  <p className="text-[10px] text-gray-400">فاصلہ</p>
                </>
              )}
            </div>
          </div>

          <button onClick={openWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2.5 transition-colors active:scale-95 mb-3 shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.11 1.523 5.84L0 24l6.335-1.498A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.626 0 11.999 0zm.001 21.818a9.818 9.818 0 01-4.993-1.366l-.358-.213-3.724.88.94-3.618-.234-.373A9.818 9.818 0 1122 12c0 5.42-4.398 9.818-9.818 9.818l-.182.001z"/>
            </svg>
            WhatsApp پر رابطہ کریں
          </button>

          {!ratingGiven[agent._id] ? (
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="text-xs text-gray-400">ریٹنگ دیں:</span>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => onRate(agent._id, s)}
                  className="hover:scale-125 transition-transform active:scale-110">
                  <Star className={`w-6 h-6 ${s <= (ratingGiven[agent._id] || 0) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 py-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <p className="text-xs text-emerald-600">آپ نے {ratingGiven[agent._id]} ستارے دیے — شکریہ!</p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}

// ── Agent List Card ───────────────────────────────────────────────────
function AgentListCard({ agent, distKm, onSelect }) {
  const eta = distKm != null ? Math.ceil((distKm / 30) * 60) : null;
  return (
    <button onClick={() => onSelect(agent)}
      className="w-full flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm transition-all text-left active:scale-[0.98]">
      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
        {agent.pfp ? (
          <img src={`${IMG_BASE}/${agent.pfp}`} alt={agent.fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
            {agent.fullName?.[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-gray-900 truncate">{agent.fullName}</p>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
            agent.status === "online" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "online" ? "bg-green-500" : "bg-amber-400"}`} />
            {agent.status === "online" ? "Online" : "Busy"}
          </span>
        </div>
        <Stars rating={agent.rating} count={agent.ratingCount} />
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <FileText className="w-3 h-3" />{agent.totalContracts} معاہدے
          </span>
          {distKm != null && (
            <span className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold">
              <Navigation className="w-3 h-3" />
              {distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`}
              {eta && ` · ~${eta} min`}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export default function AgentHub() {
  const { bargainer, logout } = useBargainerAuth();
  const navigate              = useNavigate();

  const [agents, setAgents]               = useState([]);
  const [userPos, setUserPos]             = useState(null);
  const [locError, setLocError]           = useState("");
  const [locLoading, setLocLoading]       = useState(false);
  const [loading, setLoading]             = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [ratingGiven, setRatingGiven]     = useState({});
  const [tab, setTab]                     = useState("map");
  const [mapCenter, setMapCenter]         = useState([30.38, 69.35]);
  const [showLocModal, setShowLocModal]   = useState(true);
  // "acquiring" = spinner shown on map/banner while polling; "found" = brief success flash
  const [locStatus, setLocStatus]         = useState("idle"); // "idle" | "acquiring" | "found"

  // ── Refs for location polling machinery ──────────────────────────
  // watchId: the ID returned by watchPosition (continuous updates from browser)
  // pollId:  the 1-second setInterval fallback (silent retries via getCurrentPosition)
  // permissionGranted: once true, we stop showing any error UI on retry failure
  const watchIdRef           = useRef(null);
  const pollIdRef            = useRef(null);
  const permissionGrantedRef = useRef(false);
  const userPosRef           = useRef(null); // mirrors userPos so callbacks see latest

  // Keep ref in sync with state
  useEffect(() => { userPosRef.current = userPos; }, [userPos]);

  // ── Success handler shared by both watchPosition and getCurrentPosition ──
  const handlePositionSuccess = useCallback((pos) => {
    const { latitude: lat, longitude: lng } = pos.coords;
    permissionGrantedRef.current = true;
    setLocError("");
    setLocLoading(false);
    setLocStatus("found");
    setShowLocModal(false);

    // Brief "found" flash, then settle to idle
    setTimeout(() => setLocStatus("idle"), 2500);

    const prev = userPosRef.current;
    const moved = !prev || haversine(prev.lat, prev.lng, lat, lng) > 0.02;
    if (moved) {
      setUserPos({ lat, lng });
      setMapCenter([lat, lng]);
    }

    if (pollIdRef.current !== null) {
      clearInterval(pollIdRef.current);
      pollIdRef.current = null;
    }
  }, []);

  // ── Silent retry via getCurrentPosition (used by the 1-second interval) ──
  // Does NOT touch locError or locLoading so there's no UI flicker on retry.
  const silentGetPosition = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      handlePositionSuccess,
      () => { /* silently ignore — we keep retrying */ },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, [handlePositionSuccess]);

  // ── Start the continuous location engine ─────────────────────────
  // Called when the user taps "Allow" in the modal, OR automatically retried
  // in the background once permission has been granted.
  const startLocationEngine = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("آپ کا براؤزر لوکیشن سپورٹ نہیں کرتا۔");
      setLocLoading(false);
      return;
    }

    setLocError("");
    setLocLoading(true);
    setLocStatus("acquiring");

    // 1. watchPosition fires every time the device position changes and keeps
    //    running indefinitely — this is the ideal path.
    if (watchIdRef.current === null) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionSuccess,
        (err) => {
          // watchPosition error — fall through to poll fallback below.
          // Only surface the error to the user if permission hasn't been
          // granted yet (so we don't spam red banners on GPS glitches).
          if (!permissionGrantedRef.current) {
            setLocError("لوکیشن نہیں مل سکی۔ براہ کرم browser settings میں Location Permission دیں۔");
            setLocLoading(false);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    // 2. 1-second poll fallback — silently retries getCurrentPosition every
    //    second. Once watchPosition delivers a fix (handlePositionSuccess
    //    clears pollIdRef), or the component unmounts, this stops.
    if (pollIdRef.current === null) {
      // Kick off one immediate attempt, then repeat every 1 s
      silentGetPosition();
      pollIdRef.current = setInterval(silentGetPosition, 500);
    }
  }, [handlePositionSuccess, silentGetPosition]);

  // ── Exposed "request location" for the modal button ──────────────
  const requestLocation = useCallback(() => {
    startLocationEngine();
  }, [startLocationEngine]);

  // ── Cleanup on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (pollIdRef.current !== null) {
        clearInterval(pollIdRef.current);
        pollIdRef.current = null;
      }
    };
  }, []);

  // ── Auto-start if the user had already granted permission in a ────
  // previous session (avoids needing to tap "Allow" again).
  useEffect(() => {
    if (!navigator.geolocation) return;
    // navigator.permissions is not available in all browsers; guard it
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          // Permission already granted — start silently, skip modal
          permissionGrantedRef.current = true;
          setShowLocModal(false);
          startLocationEngine();
        }
        // "prompt" → show modal as normal; "denied" → do nothing (modal handles it)
      }).catch(() => {
        // permissions API unavailable — attempt silently; modal hides if it works
        startLocationEngine();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  // ── Agents fetching ───────────────────────────────────────────────
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/agents/public`);
      const data = await res.json();
      if (data.success) setAgents(data.agents);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAgents(); }, []);
  useEffect(() => {
    const id = setInterval(fetchAgents, 30000);
    return () => clearInterval(id);
  }, [fetchAgents]);

  const agentsWithDist = agents.map(a => ({
    ...a,
    distKm: userPos && a.location?.lat != null
      ? haversine(userPos.lat, userPos.lng, a.location.lat, a.location.lng)
      : null,
  })).sort((a, b) => {
    if (a.distKm == null && b.distKm == null) return 0;
    if (a.distKm == null) return 1;
    if (b.distKm == null) return -1;
    return a.distKm - b.distKm;
  });

  const closestAgent = agentsWithDist.find(a => a.distKm != null) || null;

  const handleRate = async (agentId, stars) => {
    try {
      const res  = await fetch(`${API_BASE}/agents/rate/${agentId}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: stars }),
      });
      const data = await res.json();
      if (data.success) { setRatingGiven(p => ({ ...p, [agentId]: stars })); fetchAgents(); }
    } catch {}
  };

  const handleLogout = async () => { await logout(); navigate("/bargainer-login", { replace: true }); };

  const selectedDist = selectedAgent
    ? agentsWithDist.find(a => a._id === selectedAgent._id)?.distKm ?? null
    : null;

  // ── Location status bar (shown below top bar while acquiring/found) ──
  const LocationStatusBar = () => {
    if (locStatus === "acquiring") return (
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center gap-2.5">
        <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" />
        <p className="text-xs text-blue-700 font-medium">لوکیشن تلاش ہو رہی ہے — براہ کرم انتظار کریں...</p>
        <span className="ml-auto flex gap-1">
          {[0,1,2].map(i => (
            <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </span>
      </div>
    );
    if (locStatus === "found") return (
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center gap-2.5"
        style={{ animation: "fadeIn 0.3s ease" }}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <p className="text-xs text-emerald-700 font-medium">لوکیشن مل گئی!</p>
        {userPos && (
          <span className="text-[10px] text-emerald-500 ml-1">
            {userPos.lat.toFixed(4)}, {userPos.lng.toFixed(4)}
          </span>
        )}
      </div>
    );
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Location permission modal ── */}
      {showLocModal && !userPos && (
        <LocationModal
          onAllow={requestLocation}
          onDismiss={() => setShowLocModal(false)}
          error={locError}
          loading={locLoading}
        />
      )}

      {/* ── Top bar ── */}
      <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
            {bargainer?.pfp ? (
              <img src={`${IMG_BASE}/${bargainer.pfp}`} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-sm font-bold">
                {bargainer?.fullName?.[0]}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black leading-none tracking-tight">AgentHub</h1>
            <p className="text-[10px] text-emerald-300 truncate mt-0.5">{bargainer?.fullName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-600/60 px-2.5 py-1.5 rounded-full text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            {agents.filter(a => a.status === "online").length} آن لائن
          </div>

          {!userPos && (
            <button onClick={() => locStatus === "acquiring" ? null : setShowLocModal(true)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                locStatus === "acquiring"
                  ? "bg-blue-500/40 cursor-default"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
              title={locStatus === "acquiring" ? "لوکیشن تلاش ہو رہی ہے..." : "لوکیشن شیئر کریں"}>
              {locStatus === "acquiring"
                ? <Loader2 className="w-4 h-4 animate-spin text-white" />
                : <Locate className="w-4 h-4" />
              }
            </button>
          )}

          {userPos && (
            <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center" title="لوکیشن فعال">
              <Navigation className="w-4 h-4 text-blue-200" />
            </div>
          )}

          <button onClick={handleLogout}
            className="w-8 h-8 rounded-full hover:bg-emerald-600 flex items-center justify-center transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Location status bar ── */}
      <LocationStatusBar />

      {/* ── Closest agent banner ── */}
      {userPos && closestAgent && (
        <div onClick={() => setSelectedAgent(closestAgent)}
          className="mx-4 mt-3 bg-white rounded-2xl border border-emerald-200 p-3.5 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] shadow-sm">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-emerald-100 shrink-0">
            {closestAgent.pfp ? (
              <img src={`${IMG_BASE}/${closestAgent.pfp}`} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                {closestAgent.fullName?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Navigation className="w-3 h-3 text-emerald-600" />
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">قریب ترین ایجنٹ</p>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">{closestAgent.fullName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-black text-blue-600">
              {closestAgent.distKm < 1
                ? `${Math.round(closestAgent.distKm * 1000)}m`
                : `${closestAgent.distKm.toFixed(1)}km`}
            </p>
            <p className="text-[10px] text-gray-400">~{Math.ceil((closestAgent.distKm / 30) * 60)} min</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="flex bg-white border-b border-gray-100 mx-4 mt-3 rounded-xl overflow-hidden shadow-sm">
        {[
          { key: "list", label: "ایجنٹ لسٹ", icon: <Users className="w-3.5 h-3.5" /> },
          { key: "map",  label: "نقشہ",       icon: <MapPin className="w-3.5 h-3.5" /> },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              tab === t.key ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-700"
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {tab === "list" && (
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5 pb-10">
          {loading && agents.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">ایجنٹس لوڈ ہو رہے ہیں...</span>
            </div>
          )}
          {!loading && agents.length === 0 && (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 mt-2">
              <WifiOff className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-600">ابھی کوئی ایجنٹ آن لائن نہیں</p>
              <p className="text-sm mt-1">تھوڑی دیر بعد دوبارہ آزمائیں</p>
            </div>
          )}
          {agentsWithDist.map(a => (
            <AgentListCard key={a._id} agent={a} distKm={a.distKm} onSelect={setSelectedAgent} />
          ))}
        </div>
      )}

      {/* ── Map ── */}
      {tab === "map" && (
        <div className="flex-1 relative" style={{ minHeight: "calc(100vh - 180px)" }}>
          <MapContainer
            center={mapCenter} zoom={userPos ? 13 : 7}
            style={{ height: "100%", width: "100%", position: "absolute", inset: 0 }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {userPos && <FlyTo center={[userPos.lat, userPos.lng]} zoom={13} />}
            {userPos && (
              <>
                <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                  <Popup><div className="text-sm font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-500" /> آپ کی لوکیشن</div></Popup>
                </Marker>
                <Circle center={[userPos.lat, userPos.lng]} radius={150}
                  pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1, weight: 1 }} />
              </>
            )}
            {agentsWithDist.map((agent, i) => {
              if (!agent.location?.lat) return null;
              const isClosest = i === 0 && agent.distKm != null;
              return (
                <Marker
                  key={agent._id}
                  position={[agent.location.lat, agent.location.lng]}
                  icon={makeAgentIcon(agent, isClosest)}
                  eventHandlers={{ click: () => setSelectedAgent(agent) }}
                >
                  <Popup>
                    <div className="min-w-[150px] text-center py-1">
                      <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-gray-200">
                        {agent.pfp
                          ? <img src={`${IMG_BASE}/${agent.pfp}`} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">{agent.fullName?.[0]}</div>
                        }
                      </div>
                      <p className="font-bold text-sm text-gray-900">{agent.fullName}</p>
                      <Stars rating={agent.rating} count={agent.ratingCount} />
                      {agent.distKm != null && (
                        <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center justify-center gap-1">
                          <Navigation className="w-3 h-3" />
                          {agent.distKm < 1 ? `${Math.round(agent.distKm * 1000)}m` : `${agent.distKm.toFixed(1)}km`}
                        </p>
                      )}
                      <button onClick={() => setSelectedAgent(agent)}
                        className="mt-2 w-full bg-emerald-600 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                        رابطہ کریں
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Zoom controls */}
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
            <button id="zoom-in" className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 text-lg font-bold hover:bg-gray-50 active:bg-gray-100 border border-gray-100">+</button>
            <button id="zoom-out" className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 text-lg font-bold hover:bg-gray-50 active:bg-gray-100 border border-gray-100">−</button>
          </div>

          {!userPos && locStatus === "acquiring" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm rounded-full shadow-md px-4 py-2 flex items-center gap-2 border border-blue-100">
              <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span className="text-xs text-blue-700 font-semibold whitespace-nowrap">لوکیشن تلاش ہو رہی ہے...</span>
            </div>
          )}

          {!userPos && locStatus !== "acquiring" && (
            <button onClick={() => setShowLocModal(true)}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-600 text-white font-bold px-5 py-3 rounded-full shadow-lg text-sm flex items-center gap-2 hover:bg-emerald-700 transition-colors">
              <Locate className="w-4 h-4" />
              لوکیشن شیئر کریں
            </button>
          )}
        </div>
      )}

      {/* ── Agent bottom sheet ── */}
      <AgentSheet
        agent={selectedAgent}
        distKm={selectedDist}
        userPos={userPos}
        onClose={() => setSelectedAgent(null)}
        onRate={handleRate}
        ratingGiven={ratingGiven}
      />

    </div>
  );
}