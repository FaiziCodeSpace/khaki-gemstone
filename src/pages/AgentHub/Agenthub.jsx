// pages/public/AgentHub.jsx
// Stack: react-leaflet + OpenStreetMap (free, no API key)
// Install: npm install react-leaflet leaflet
// Distance: Haversine formula (pure JS)

import { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon (Vite/webpack strips assets)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// ── Haversine distance (km) ──────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Custom map icons ─────────────────────────────────────────────────
const userIcon = new L.DivIcon({
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#3b82f6;border:3px solid #fff;
    box-shadow:0 0 0 3px rgba(59,130,246,0.4);
  "></div>`,
  className: "",
  iconSize:  [18, 18],
  iconAnchor:[9, 9],
});

const agentIcon = (isClosest) => new L.DivIcon({
  html: `<div style="
    width:${isClosest ? 26 : 20}px;height:${isClosest ? 26 : 20}px;border-radius:50%;
    background:${isClosest ? "#16a34a" : "#f59e0b"};
    border:3px solid #fff;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);
    display:flex;align-items:center;justify-content:center;
    font-size:${isClosest ? 14 : 11}px;
  ">👤</div>`,
  className: "",
  iconSize:  [isClosest ? 26 : 20, isClosest ? 26 : 20],
  iconAnchor:[isClosest ? 13 : 10, isClosest ? 13 : 10],
});

// ── Fly-to helper ────────────────────────────────────────────────────
function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 14, { duration: 1.5 });
  }, [center]);
  return null;
}

// ── Star rating display ──────────────────────────────────────────────
function Stars({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={s <= Math.round(rating) ? "#f59e0b" : "#e5e7eb"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-0.5">({count})</span>
    </div>
  );
}

// ── Agent Card ───────────────────────────────────────────────────────
function AgentCard({ agent, isClosest, distKm, onSelect, selected }) {
  const eta = distKm != null ? Math.ceil(distKm / 30 * 60) : null; // ~30km/h avg

  return (
    <div
      onClick={() => onSelect(agent)}
      className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
        selected ? "border-green-500 bg-green-50 shadow-md" : isClosest
          ? "border-amber-400 bg-amber-50"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {agent.pfp ? (
          <img
            src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/${agent.pfp}`}
            alt={agent.fullName}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow">
            {agent.fullName?.[0]}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <div>
            <p className="text-sm font-bold text-gray-900 truncate">{agent.fullName}</p>
            <Stars rating={agent.rating} count={agent.ratingCount} />
          </div>
          <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            agent.status === "online" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          }`}>
            {agent.status === "online" ? "Online" : "Busy"}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="text-[11px] text-gray-500">📄 {agent.totalContracts} contracts</span>
          {distKm != null && (
            <span className="text-[11px] text-blue-600 font-semibold">
              📍 {distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`}
              {eta && ` · ~${eta} min`}
            </span>
          )}
          {isClosest && (
            <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">NEAREST</span>
          )}
        </div>

        <p className="text-[10px] text-gray-400 mt-1 truncate">🏢 {agent.officeAddress || "—"}</p>
      </div>
    </div>
  );
}

// ── Main AgentHub Component ──────────────────────────────────────────
export default function AgentHub() {
  const [agents, setAgents]             = useState([]);
  const [userPos, setUserPos]           = useState(null);  // { lat, lng }
  const [locError, setLocError]         = useState("");
  const [loading, setLoading]           = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [locationShared, setLocationShared] = useState(false);
  const [mapCenter, setMapCenter]       = useState([30.1798, 66.9750]); // Pakistan center
  const [showMap, setShowMap]           = useState(false);
  const [ratingGiven, setRatingGiven]   = useState({});
  const [tab, setTab]                   = useState("list"); // "list" | "map"

  // Fetch all online agents
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/agents/public`);
      const data = await res.json();
      if (data.success) setAgents(data.agents);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAgents(); }, []);

  // Poll every 30s
  useEffect(() => {
    const id = setInterval(fetchAgents, 30000);
    return () => clearInterval(id);
  }, [fetchAgents]);

  // Sort agents by distance if we have user position
  const agentsWithDist = agents.map((a) => ({
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

  const closestAgent = agentsWithDist[0] || null;

  // Request user location
  const requestLocation = () => {
    setLocError("");
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        setMapCenter([lat, lng]);
        setShowMap(true);
        setTab("map");
      },
      (err) => {
        setLocError("Could not get your location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Share location with selected agent via WhatsApp
  const shareLocationWithAgent = () => {
    if (!selectedAgent || !userPos) return;
    const mapsLink = `https://www.google.com/maps?q=${userPos.lat},${userPos.lng}`;
    const msg = encodeURIComponent(
      `السلام علیکم! میں آپ سے اقرار نامہ کی مدد چاہتا ہوں۔ میری موجودہ لوکیشن: ${mapsLink}`
    );
    const wa = selectedAgent.whatsapp?.replace(/\D/g, "");
    if (wa) {
      window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
    } else {
      alert("This agent has not provided a WhatsApp number.");
    }
    setLocationShared(true);
  };

  // Rate an agent
  const handleRate = async (agentId, stars) => {
    try {
      const res = await fetch(`${API_BASE}/agents/rate/${agentId}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ rating: stars }),
      });
      const data = await res.json();
      if (data.success) {
        setRatingGiven((prev) => ({ ...prev, [agentId]: stars }));
        fetchAgents();
      }
    } catch {}
  };

  const STATUS_TEXT = { online: "Online", busy: "Busy", offline: "Offline" };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white px-4 pt-10 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"/>
            {agents.filter(a => a.status === "online").length} agents online
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">AgentHub</h1>
          <p className="text-emerald-200 text-sm sm:text-base max-w-md mx-auto">
            قریب ترین اقرار نامہ ایجنٹ سے فوری رابطہ کریں
          </p>

          {!userPos && (
            <button
              onClick={requestLocation}
              className="mt-6 bg-white text-emerald-800 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 mx-auto text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              قریب ترین ایجنٹ تلاش کریں
            </button>
          )}

          {locError && (
            <div className="mt-3 text-red-300 text-xs bg-red-900/30 px-4 py-2 rounded-lg inline-block">
              ⚠️ {locError}
            </div>
          )}

          {userPos && (
            <div className="mt-3 text-emerald-200 text-xs">
              ✅ Location detected · {agentsWithDist.filter(a => a.distKm != null).length} agents located nearby
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-2xl mx-auto px-4 -mt-12">

        {/* Closest agent highlight */}
        {userPos && closestAgent && closestAgent.distKm != null && (
          <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-4 mb-5">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">⚡ قریب ترین ایجنٹ</p>
            <AgentCard
              agent={closestAgent}
              isClosest
              distKm={closestAgent.distKm}
              onSelect={setSelectedAgent}
              selected={selectedAgent?._id === closestAgent._id}
            />
            {selectedAgent?._id === closestAgent._id && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={shareLocationWithAgent}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.11 1.523 5.84L0 24l6.335-1.498A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.626 0 11.999 0zm.001 21.818a9.818 9.818 0 01-4.993-1.366l-.358-.213-3.724.88.94-3.618-.234-.373A9.818 9.818 0 1122 12c0 5.42-4.398 9.818-9.818 9.818l-.182.001z"/>
                  </svg>
                  WhatsApp پر لوکیشن بھیجیں
                </button>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm"
                >
                  منسوخ
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab bar */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 mb-4 shadow-sm">
          {["list", "map"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t ? "bg-emerald-600 text-white shadow" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t === "list" ? "📋 Agent List" : "🗺️ Map View"}
            </button>
          ))}
        </div>

        {/* ── Agent List ── */}
        {tab === "list" && (
          <div className="flex flex-col gap-3 pb-10">
            {loading && agents.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-6 h-6 animate-spin mx-auto mb-2" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                ایجنٹس لوڈ ہو رہے ہیں...
              </div>
            )}
            {!loading && agents.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <p className="text-4xl mb-3">😴</p>
                <p className="font-semibold">ابھی کوئی ایجنٹ آن لائن نہیں</p>
                <p className="text-sm mt-1">تھوڑی دیر بعد دوبارہ چیک کریں</p>
              </div>
            )}
            {agentsWithDist.map((agent) => (
              <div key={agent._id}>
                <AgentCard
                  agent={agent}
                  isClosest={false}
                  distKm={agent.distKm}
                  onSelect={setSelectedAgent}
                  selected={selectedAgent?._id === agent._id}
                />
                {selectedAgent?._id === agent._id && (
                  <div className="mt-2 bg-white rounded-xl border border-gray-100 p-3 flex flex-col gap-2">
                    {/* WhatsApp button */}
                    <button
                      onClick={() => {
                        const wa = agent.whatsapp?.replace(/\D/g, "");
                        const loc = userPos
                          ? `https://www.google.com/maps?q=${userPos.lat},${userPos.lng}`
                          : "";
                        const msg = encodeURIComponent(
                          `السلام علیکم! مجھے اقرار نامہ کی ضرورت ہے۔${loc ? ` میری لوکیشن: ${loc}` : ""}`
                        );
                        if (wa) window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");
                        else alert("WhatsApp number not available");
                      }}
                      className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.11 1.523 5.84L0 24l6.335-1.498A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.626 0 11.999 0zm.001 21.818a9.818 9.818 0 01-4.993-1.366l-.358-.213-3.724.88.94-3.618-.234-.373A9.818 9.818 0 1122 12c0 5.42-4.398 9.818-9.818 9.818l-.182.001z"/>
                      </svg>
                      WhatsApp پر رابطہ کریں
                    </button>

                    {/* Rate */}
                    {!ratingGiven[agent._id] ? (
                      <div className="flex items-center gap-1 justify-center">
                        <span className="text-xs text-gray-500 mr-1">Rating دیں:</span>
                        {[1,2,3,4,5].map((s) => (
                          <button key={s} onClick={() => handleRate(agent._id, s)}
                            className="text-xl hover:scale-125 transition-transform">
                            ⭐
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-center text-emerald-600">✅ شکریہ! آپ نے {ratingGiven[agent._id]} ⭐ دی۔</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Map View ── */}
        {tab === "map" && (
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg mb-10" style={{ height: 480 }}>
            <MapContainer
              center={mapCenter}
              zoom={userPos ? 13 : 6}
              style={{ height: "100%", width: "100%" }}
              zoomControl
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {userPos && <FlyTo center={[userPos.lat, userPos.lng]} zoom={13} />}

              {/* User marker */}
              {userPos && (
                <>
                  <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                    <Popup>
                      <div className="text-sm font-semibold">📍 آپ کی لوکیشن</div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={[userPos.lat, userPos.lng]}
                    radius={200}
                    pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1, weight: 1 }}
                  />
                </>
              )}

              {/* Agent markers */}
              {agentsWithDist.map((agent, i) => {
                if (!agent.location?.lat) return null;
                const isClosest = i === 0 && agent.distKm != null;
                return (
                  <Marker
                    key={agent._id}
                    position={[agent.location.lat, agent.location.lng]}
                    icon={agentIcon(isClosest)}
                    eventHandlers={{ click: () => setSelectedAgent(agent) }}
                  >
                    <Popup>
                      <div className="min-w-[160px]">
                        <p className="font-bold text-sm">{agent.fullName}</p>
                        <Stars rating={agent.rating} count={agent.ratingCount} />
                        <p className="text-xs text-gray-500 mt-1">📄 {agent.totalContracts} contracts</p>
                        {agent.distKm != null && (
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">
                            {agent.distKm < 1 ? `${Math.round(agent.distKm * 1000)}m` : `${agent.distKm.toFixed(1)}km`} away
                          </p>
                        )}
                        {agent.whatsapp && (
                          <a
                            href={`https://wa.me/${agent.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block text-center bg-[#25D366] text-white text-xs font-bold py-1.5 rounded-lg"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        )}

        {/* Location CTA if not shared */}
        {tab === "map" && !userPos && (
          <div className="text-center py-6 pb-10">
            <p className="text-gray-500 text-sm mb-3">نقشہ دیکھنے اور قریب ترین ایجنٹ تلاش کرنے کے لیے لوکیشن اجازت دیں</p>
            <button onClick={requestLocation}
              className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors">
              📍 لوکیشن شیئر کریں
            </button>
          </div>
        )}
      </div>
    </div>
  );
}