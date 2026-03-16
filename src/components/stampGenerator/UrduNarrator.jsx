// UrduNarrator.jsx
// API key + voice ID both come from .env — no hardcoded library voices.
// Free-tier ElevenLabs only allows voices from your own "My Voices" tab.
// See .env.example for setup instructions.

import { useState, useRef, useEffect } from "react";

const API_KEY  = import.meta.env.VITE_ELEVENLABS_API_KEY  || "";
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || "";
const MODEL_ID = "eleven_multilingual_v2";

function chunkText(text, size = 400) {
  const sentences = text.split(/(?<=[۔؟!\.\?])\s+/);
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if ((current + s).length > size && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += (current ? " " : "") + s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text];
}

export default function UrduNarrator({ getText }) {
  const [status, setStatus]           = useState("idle");
  const [errorMsg, setErrorMsg]       = useState("");
  const [chunkIndex, setChunkIndex]   = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [rate, setRate]               = useState(0.9);

  const audioRef   = useRef(new Audio());
  const blobsRef   = useRef([]);
  const stoppedRef = useRef(false);

  useEffect(() => () => {
    blobsRef.current.forEach(u => URL.revokeObjectURL(u));
    audioRef.current.pause();
  }, []);

  // ── Config missing — show setup guide ──
  if (!API_KEY || !VOICE_ID) {
    return (
      <div className="flex flex-col gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs font-bold text-amber-800">⚙️ ElevenLabs سیٹ اپ</p>

        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-amber-700">
            {!API_KEY ? "❌ VITE_ELEVENLABS_API_KEY نہیں ملی" : "✅ API Key مل گئی"}
          </p>
          <p className="text-xs font-semibold text-amber-700">
            {!VOICE_ID ? "❌ VITE_ELEVENLABS_VOICE_ID نہیں ملی" : "✅ Voice ID مل گئی"}
          </p>
        </div>

        <div className="text-xs text-amber-800 leading-relaxed space-y-2">
          <p><strong>Voice ID کیسے ملے گی:</strong></p>
          <ol className="list-decimal list-inside space-y-1 text-amber-700">
            <li>elevenlabs.io پر لاگ ان کریں</li>
            <li>بائیں طرف <strong>Voices → My Voices</strong> کھولیں</li>
            <li>کسی بھی آواز کے آگے <strong>⋯ → Copy Voice ID</strong> کریں</li>
            <li>نیچے <code className="bg-amber-100 px-1 rounded">.env</code> میں ڈالیں</li>
          </ol>
        </div>

        <code className="text-xs bg-amber-100 text-amber-900 px-3 py-2 rounded-lg block leading-relaxed select-all whitespace-pre">
{`VITE_ELEVENLABS_API_KEY=your_api_key_here
VITE_ELEVENLABS_VOICE_ID=your_voice_id_here`}
        </code>

        <p className="text-xs text-amber-600">
          فائل محفوظ کریں پھر <code className="bg-amber-100 px-1 rounded">npm run dev</code> دوبارہ چلائیں
        </p>
      </div>
    );
  }

  // ── Fetch one chunk ──
  const fetchChunk = async (text) => {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          model_id: MODEL_ID,
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.detail?.message || `ElevenLabs error ${res.status}`);
    }
    return URL.createObjectURL(await res.blob());
  };

  const playFrom = (index, urls) => {
    if (stoppedRef.current || index >= urls.length) {
      if (!stoppedRef.current) setStatus("idle");
      return;
    }
    const audio = audioRef.current;
    audio.src = urls[index];
    audio.playbackRate = rate;
    setChunkIndex(index + 1);
    setStatus("playing");
    audio.play().catch(() => setStatus("idle"));
    audio.onended = () => playFrom(index + 1, urls);
  };

  const play = async () => {
    if (status === "paused") {
      stoppedRef.current = false;
      audioRef.current.play();
      setStatus("playing");
      return;
    }

    const text = getText();
    if (!text.trim()) return;

    blobsRef.current.forEach(u => URL.revokeObjectURL(u));
    blobsRef.current = [];
    stoppedRef.current = false;
    setErrorMsg("");

    const chunks = chunkText(text);
    setTotalChunks(chunks.length);
    setChunkIndex(0);
    setStatus("loading");

    try {
      const urls = [];
      for (const chunk of chunks) {
        const url = await fetchChunk(chunk);
        urls.push(url);
        blobsRef.current.push(url);
      }
      playFrom(0, urls);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.message);
    }
  };

  const pause = () => { audioRef.current.pause(); setStatus("paused"); };

  const stop = () => {
    stoppedRef.current = true;
    audioRef.current.pause();
    audioRef.current.src = "";
    setStatus("idle");
    setChunkIndex(0);
    setTotalChunks(0);
  };

  const dotColor = {
    idle:    "bg-slate-300",
    loading: "bg-amber-400 animate-pulse",
    playing: "bg-emerald-500 animate-pulse",
    paused:  "bg-amber-400",
    error:   "bg-red-500",
  }[status];

  const statusLabel = {
    idle:    "آواز سے پڑھیں",
    loading: "آواز تیار ہو رہی ہے...",
    playing: "پڑھا جا رہا ہے...",
    paused:  "رکا ہوا",
    error:   "خرابی",
  }[status];

  return (
    <div className="flex flex-col gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${dotColor}`} />
          <span className="text-xs font-semibold text-slate-600">{statusLabel}</span>
        </div>
        <span className="text-xs text-slate-400">ElevenLabs · اردو</span>
      </div>

      {status === "error" && errorMsg && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          ⚠️ {errorMsg}
        </div>
      )}

      {totalChunks > 1 && status !== "idle" && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(chunkIndex / totalChunks) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-400 shrink-0">{chunkIndex}/{totalChunks}</span>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">

        {status === "playing" ? (
          <button onClick={pause}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
            Pause
          </button>
        ) : (
          <button onClick={play} disabled={status === "loading"}
            className={`flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors
              ${status === "loading" ? "bg-emerald-400 cursor-wait" : "bg-emerald-600 hover:bg-emerald-700"}`}>
            {status === "loading" ? (
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
            {status === "paused" ? "Resume" : status === "loading" ? "Loading..." : "Play"}
          </button>
        )}

        {status !== "idle" && (
          <button onClick={stop}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z"/>
            </svg>
            Stop
          </button>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-xs text-slate-400">رفتار</span>
          <select value={rate}
            onChange={e => { const r = Number(e.target.value); setRate(r); audioRef.current.playbackRate = r; }}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value={0.75}>0.75×</option>
            <option value={0.9}>0.9×</option>
            <option value={1}>1×</option>
            <option value={1.2}>1.2×</option>
          </select>
        </div>
      </div>

    </div>
  );
}