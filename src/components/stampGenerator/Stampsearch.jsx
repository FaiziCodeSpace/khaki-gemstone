// pages/stamp/StampSearch.jsx
// Route: /stampGenerator/search  (agent protected)
// Search contracts by chassis, reg, seller, buyer name, or model year

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAgentAuth } from "../../context/Agentauthcontext";
import agentApi from "../../services/agentServices/api.agentService";

const STATUS_CONFIG = {
  online:  { dot: "bg-green-500", text: "text-green-700", bg: "bg-green-50",  border: "border-green-200",  label: "Online"  },
  busy:    { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50",  border: "border-amber-200",  label: "Busy"    },
  offline: { dot: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200", label: "Offline" },
};

export default function StampSearch() {
  const { agent, logout } = useAgentAuth();
  const [query, setQuery]     = useState("");
  const [year, setYear]       = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus]   = useState("idle");
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  const sc = STATUS_CONFIG[agent?.status || "offline"];

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim() && !year.trim()) return;
    setStatus("loading"); setSearched(true); setErrorMsg("");
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (year.trim())  params.set("year", year.trim());
      const res = await agentApi.get(`/stamps/search?${params}`);
      setResults(res.data.contracts || []);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Search failed");
      setStatus("error");
    }
  };

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" }) : "—";

  return (
    <div className="min-h-screen bg-slate-100">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');`}</style>

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-800 leading-none">معاہدہ تلاش</h1>
              <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Search Contracts</p>
            </div>
          </div>

          <Link to="/stampGenerator"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            New Contract
          </Link>

          {/* Status dot */}
          <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${sc.bg} ${sc.border} ${sc.text}`}>
            <span className={`w-2 h-2 rounded-full ${sc.dot}`}/>
            <span className="hidden sm:block">{sc.label}</span>
          </div>

          {agent && (
            <div className="flex items-center gap-2 shrink-0">
              {agent.pfp ? (
                <img src={`${import.meta.env.VITE_API_URL?.replace("/api","")}/${agent.pfp}`}
                  alt={agent.fullName} className="w-7 h-7 rounded-full object-cover border border-slate-200"/>
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                  {agent.fullName?.[0] || "A"}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-700 hidden sm:block truncate max-w-[100px]">{agent.fullName}</span>
            </div>
          )}

          <button onClick={() => { logout(); window.location.href = "/agent/login"; }}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 px-3 py-1.5 rounded-lg transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

        {/* Search card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Chassis / Reg No / Seller / Buyer / Model
              </label>
              <div className="relative">
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="RA410PK561670  /  PZ-031  /  عبداللہ خان" dir="rtl"
                  className="w-full border border-slate-200 rounded-xl pr-10 pl-4 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-300 text-right"/>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Model Year (optional)</label>
              <input type="text" value={year} onChange={e => setYear(e.target.value)} placeholder="2010"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-300"/>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={status === "loading" || (!query.trim() && !year.trim())}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all
                  ${status === "loading" ? "bg-emerald-400 cursor-wait text-white"
                  : !query.trim() && !year.trim() ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-95"}`}>
                {status === "loading" ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                )}
                {status === "loading" ? "تلاش جاری ہے..." : "تلاش کریں"}
              </button>
              {searched && (
                <button type="button" onClick={() => { setQuery(""); setYear(""); setResults([]); setStatus("idle"); setSearched(false); }}
                  className="px-4 py-3 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50">
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error */}
        {status === "error" && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">⚠️ {errorMsg}</div>
        )}

        {/* Results */}
        {status === "done" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                {results.length === 0 ? "کوئی نتیجہ نہیں ملا" : `${results.length} معاہدے ملے`}
              </p>
              {results.length > 0 && <span className="text-xs text-slate-400">تازہ ترین پہلے</span>}
            </div>

            {results.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                <p className="text-sm text-slate-500" dir="rtl">کوئی معاہدہ نہیں ملا</p>
              </div>
            )}

            {results.map((c) => (
              <div key={c._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 hover:border-emerald-200 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-800" dir="rtl">{c.carModel || "گاڑی"} — {c.modelYear || "—"}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{c.chassisNo || "—"}</p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg shrink-0">{formatDate(c.createdAt)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 rounded-lg p-3" dir="rtl">
                    <p className="text-slate-400 mb-0.5">فریق اول</p>
                    <p className="font-semibold text-slate-700">{c.sellerName || "—"}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3" dir="rtl">
                    <p className="text-slate-400 mb-0.5">فریق دوم</p>
                    <p className="font-semibold text-slate-700">{c.buyerName || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Reg: <strong className="text-slate-600">{c.regNo || "—"}</strong></span>
                    <span>Date: <strong className="text-slate-600">{c.date || "—"}</strong></span>
                  </div>
                  {c.pdfUrl && (
                    <a href={c.pdfUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      PDF دیکھیں
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}