// pages/public/AgentHub.jsx
// Protected — requires BargainerProtectedRoute
// Stack: react-leaflet + OpenStreetMap (free, no API key)
// Mobile-first design: map fills screen, agent cards slide up from bottom

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useBargainerAuth } from "../../context/BargainerAuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const IMG_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

// Fix Leaflet default icon (Vite strips assets)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Haversine ────────────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, toR = (d) => (d * Math.PI) / 180;
  const a =
    Math.sin(toR(lat2 - lat1) / 2) ** 2 +
    Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(toR(lng2 - lng1) / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── User location dot ────────────────────────────────────────────────
const userIcon = new L.DivIcon({
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 0 0 3px rgba(59,130,246,0.35)"></div>`,
  className: "", iconSize: [16, 16], iconAnchor: [8, 8],
});

// ── Agent marker — uses pfp if available, else initial ───────────────
const makeAgentIcon = (agent, isClosest) => {
  const size  = isClosest ? 46 : 38;
  const ring  = isClosest ? "3px solid #16a34a" : "2px solid #fff";
  const shadow = isClosest
    ? "box-shadow:0 0 0 3px rgba(22,163,74,0.4),0 4px 12px rgba(0,0,0,0.25)"
    : "box-shadow:0 2px 8px rgba(0,0,0,0.2)";
  const inner = agent.pfp
    ? `<img src="${IMG_BASE}/${agent.pfp}" style="width:100%;height:100%;object-fit:cover;border-radius:50%" />`
    : `<span style="color:#fff;font-size:${isClosest ? 18 : 15}px;font-weight:bold;line-height:1">${agent.fullName?.[0] || "A"}</span>`;
  const bg = agent.pfp ? "transparent" : (isClosest ? "#16a34a" : "#f59e0b");

  return new L.DivIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${bg};border:${ring};${shadow};
      display:flex;align-items:center;justify-content:center;overflow:hidden;
    ">${inner}</div>`,
    className: "",
    iconSize:  [size, size],
    iconAnchor:[size / 2, size / 2],
  });
};

// ── FlyTo helper ─────────────────────────────────────────────────────
function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, zoom || 13, { duration: 1.2 }); }, [center]);
  return null;
}

// ── Stars ─────────────────────────────────────────────────────────────
function Stars({ rating, count }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className="w-3 h-3" viewBox="0 0 20 20"
          fill={s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-[10px] text-gray-400 ml-0.5">({count})</span>
    </div>
  );
}

// ── Agent Bottom Sheet (slides up when agent is selected) ─────────────
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
      {/* Backdrop */}
      <div className="fixed inset-0 z-[400] bg-black/30 backdrop-blur-sm" onClick={onClose} />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[500] bg-white rounded-t-3xl shadow-2xl px-5 pt-5 pb-8 max-w-lg mx-auto"
        style={{ animation: "slideUp 0.25s ease" }}>
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />

        {/* Agent info */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-emerald-100 shadow">
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
              <h3 className="font-bold text-gray-900 text-base">{agent.fullName}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                agent.status === "online" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>{agent.status === "online" ? "Online" : "Busy"}</span>
            </div>
            <Stars rating={agent.rating} count={agent.ratingCount} />
            <p className="text-xs text-gray-400 mt-0.5 truncate">🏢 {agent.officeAddress || "—"}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-base font-black text-gray-900">{agent.totalContracts}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Contracts</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-base font-black text-gray-900">{agent.rating.toFixed(1)}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Rating</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            {distKm != null ? (
              <>
                <p className="text-base font-black text-blue-600">
                  {distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{eta ? `~${eta} min` : "Away"}</p>
              </>
            ) : (
              <>
                <p className="text-base font-black text-gray-400">—</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Distance</p>
              </>
            )}
          </div>
        </div>

        {/* WhatsApp button */}
        <button onClick={openWhatsApp}
          className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2.5 transition-colors active:scale-95 mb-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.11 1.523 5.84L0 24l6.335-1.498A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.626 0 11.999 0zm.001 21.818a9.818 9.818 0 01-4.993-1.366l-.358-.213-3.724.88.94-3.618-.234-.373A9.818 9.818 0 1122 12c0 5.42-4.398 9.818-9.818 9.818l-.182.001z"/>
          </svg>
          WhatsApp پر رابطہ کریں
        </button>

        {/* Rate */}
        {!ratingGiven[agent._id] ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-gray-400">Rating دیں:</span>
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => onRate(agent._id, s)}
                className="text-2xl hover:scale-125 transition-transform active:scale-110">⭐</button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-center text-emerald-600">✅ آپ نے {ratingGiven[agent._id]} ⭐ دی — شکریہ!</p>
        )}
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
    </>
  );
}

// ── Agent List Card ──────────────────────────────────────────────────
function AgentListCard({ agent, distKm, onSelect }) {
  const eta = distKm != null ? Math.ceil((distKm / 30) * 60) : null;
  return (
    <button onClick={() => onSelect(agent)}
      className="w-full flex gap-3 p-3.5 rounded-2xl border border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm transition-all text-left active:scale-[0.98]">
      <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-gray-100">
        {agent.pfp ? (
          <img src={`${IMG_BASE}/${agent.pfp}`} alt={agent.fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold">
            {agent.fullName?.[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-gray-900 truncate">{agent.fullName}</p>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            agent.status === "online" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}>{agent.status === "online" ? "Online" : "Busy"}</span>
        </div>
        <Stars rating={agent.rating} count={agent.ratingCount} />
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[11px] text-gray-400">📄 {agent.totalContracts}</span>
          {distKm != null && (
            <span className="text-[11px] text-blue-600 font-semibold">
              📍 {distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`}
              {eta && ` · ~${eta} min`}
            </span>
          )}
        </div>
      </div>
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
  const [loading, setLoading]             = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [ratingGiven, setRatingGiven]     = useState({});
  const [tab, setTab]                     = useState("list");
  const [mapCenter, setMapCenter]         = useState([30.38, 69.35]); // KP center

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/agents/public`);
      const data = await res.json();
      if (data.success) setAgents(data.agents);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAgents(); }, []);
  useEffect(() => { const id = setInterval(fetchAgents, 30000); return () => clearInterval(id); }, [fetchAgents]);

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

  const requestLocation = () => {
    setLocError("");
    if (!navigator.geolocation) { setLocError("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        setMapCenter([lat, lng]);
        setTab("map");
      },
      () => setLocError("لوکیشن نہیں مل سکی۔ براہ کرم Permission دیں۔"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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

  // Get distKm for selected agent
  const selectedDist = selectedAgent
    ? agentsWithDist.find(a => a._id === selectedAgent._id)?.distKm ?? null
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top bar ── */}
      <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
            {bargainer?.pfp ? (
              <img src={`${IMG_BASE}/${bargainer.pfp}`} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-sm font-bold">
                {bargainer?.fullName?.[0]}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-black leading-none">AgentHub</h1>
            <p className="text-[10px] text-emerald-300 truncate">{bargainer?.fullName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-600/50 px-2.5 py-1 rounded-full text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            {agents.filter(a => a.status === "online").length} online
          </div>
          <button onClick={handleLogout} className="p-1.5 hover:bg-emerald-600 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Location CTA strip ── */}
      {!userPos && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5 flex items-center gap-3">
          <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <p className="text-xs text-blue-700 flex-1">
            {locError || "قریب ترین ایجنٹ تلاش کرنے کے لیے لوکیشن شیئر کریں"}
          </p>
          <button onClick={requestLocation}
            className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 hover:bg-blue-700 transition-colors">
            Allow
          </button>
        </div>
      )}

      {/* ── Closest agent banner ── */}
      {userPos && closestAgent && (
        <div onClick={() => setSelectedAgent(closestAgent)}
          className="mx-4 mt-3 bg-white rounded-2xl border border-emerald-200 p-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 shrink-0">
            {closestAgent.pfp ? (
              <img src={`${IMG_BASE}/${closestAgent.pfp}`} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                {closestAgent.fullName?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">⚡ قریب ترین</p>
            <p className="text-sm font-bold text-gray-900 truncate">{closestAgent.fullName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-black text-blue-600">
              {closestAgent.distKm < 1
                ? `${Math.round(closestAgent.distKm * 1000)}m`
                : `${closestAgent.distKm.toFixed(1)}km`}
            </p>
            <p className="text-[10px] text-gray-400">
              ~{Math.ceil((closestAgent.distKm / 30) * 60)} min
            </p>
          </div>
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="flex bg-white border-b border-gray-100 mx-4 mt-3 rounded-xl overflow-hidden shadow-sm">
        {["list", "map"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-semibold transition-all ${
              tab === t ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-700"
            }`}>
            {t === "list" ? "📋 ایجنٹ لسٹ" : "🗺️ نقشہ"}
          </button>
        ))}
      </div>

      {/* ── List ── */}
      {tab === "list" && (
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5 pb-10">
          {loading && agents.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              ایجنٹس لوڈ ہو رہے ہیں...
            </div>
          )}
          {!loading && agents.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">😴</p>
              <p className="font-semibold">ابھی کوئی ایجنٹ آن لائن نہیں</p>
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
                  <Popup><div className="text-sm font-semibold">📍 آپ کی لوکیشن</div></Popup>
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
                    <div className="min-w-[140px] text-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mx-auto mb-1 border border-gray-200">
                        {agent.pfp
                          ? <img src={`${IMG_BASE}/${agent.pfp}`} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-bold">{agent.fullName?.[0]}</div>
                        }
                      </div>
                      <p className="font-bold text-sm">{agent.fullName}</p>
                      <Stars rating={agent.rating} count={agent.ratingCount} />
                      {agent.distKm != null && (
                        <p className="text-xs text-blue-600 font-semibold mt-0.5">
                          {agent.distKm < 1 ? `${Math.round(agent.distKm * 1000)}m` : `${agent.distKm.toFixed(1)}km`}
                        </p>
                      )}
                      <button onClick={() => setSelectedAgent(agent)}
                        className="mt-2 w-full bg-emerald-600 text-white text-xs font-bold py-1.5 rounded-lg">
                        رابطہ کریں
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Zoom controls (custom, mobile-friendly) */}
          <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1">
            <button id="zoom-in" className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-700 text-lg font-bold hover:bg-gray-50 active:bg-gray-100 border border-gray-200">+</button>
            <button id="zoom-out" className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-700 text-lg font-bold hover:bg-gray-50 active:bg-gray-100 border border-gray-200">−</button>
          </div>

          {/* My location button */}
          {!userPos && (
            <button onClick={requestLocation}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-full shadow-lg text-sm flex items-center gap-2 hover:bg-emerald-700 transition-colors">
              📍 میری لوکیشن
            </button>
          )}
        </div>
      )}

      {/* ── Bottom sheet for selected agent ── */}
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