import { useRef, useEffect, useState, useCallback } from "react";

const COLORS = [
  { label: "Black",     value: "#111111" },
  { label: "Navy Blue", value: "#1a237e" },
  { label: "Dark Blue", value: "#0d47a1" },
];

export default function SignaturePad({ label, value, onSave, onClear }) {
  const canvasRef   = useRef(null);
  const drawing     = useRef(false);
  const lastPos     = useRef(null);
  const hasMoved    = useRef(false); // track if pointer moved (for dot detection)
  const [isEmpty, setIsEmpty]   = useState(true);
  const [color, setColor]       = useState(COLORS[0].value);
  const colorRef = useRef(color);

  // Keep colorRef in sync so canvas handlers always use latest color
  useEffect(() => { colorRef.current = color; }, [color]);

  // ── Setup canvas ──
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    applyCtxStyle(ctx);
  }, []);

  const applyCtxStyle = (ctx) => {
    ctx.lineCap   = "round";
    ctx.lineJoin  = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = colorRef.current;
    ctx.fillStyle   = colorRef.current;
  };

  useEffect(() => {
    setupCanvas();
    // Restore saved signature if any
    if (value) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = value;
      setIsEmpty(false);
    }
  }, []);

  // ── Get position from any pointer event ──
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure ?? 0.5,
    };
  };

  // ── Pointer Down ──
  const onPointerDown = (e) => {
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    drawing.current = true;
    hasMoved.current = false;

    const { x, y, pressure } = getPos(e);
    lastPos.current = { x, y };

    const ctx = canvasRef.current.getContext("2d");
    applyCtxStyle(ctx);
    ctx.strokeStyle = colorRef.current;
    ctx.fillStyle   = colorRef.current;
    ctx.lineWidth   = pressure > 0 ? Math.max(1.5, pressure * 3.5) : 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  // ── Pointer Move ──
  const onPointerMove = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    hasMoved.current = true;

    const { x, y, pressure } = getPos(e);
    const ctx = canvasRef.current.getContext("2d");

    applyCtxStyle(ctx);
    ctx.strokeStyle = colorRef.current;
    ctx.lineWidth   = pressure > 0 ? Math.max(1.5, pressure * 3.5) : 2;

    ctx.lineTo(x, y);
    ctx.stroke();

    // Start a new path segment from current point for smooth pressure transitions
    ctx.beginPath();
    ctx.moveTo(x, y);

    lastPos.current = { x, y };
    setIsEmpty(false);
  };

  // ── Pointer Up ──
  const onPointerUp = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    drawing.current = false;

    // Draw a dot if the pen didn't move (single tap/click)
    if (!hasMoved.current && lastPos.current) {
      const ctx = canvasRef.current.getContext("2d");
      applyCtxStyle(ctx);
      ctx.fillStyle = colorRef.current;
      ctx.beginPath();
      ctx.arc(lastPos.current.x, lastPos.current.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
      setIsEmpty(false);
    }

    onSave(canvasRef.current.toDataURL("image/png"));
  };

  // ── Clear ──
  const handleClear = () => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const ctx    = canvas.getContext("2d");
    ctx.clearRect(0, 0, rect.width, rect.height);
    setIsEmpty(true);
    onClear();
  };

  // ── Color change — redraw with new color if needed ──
  const handleColorChange = (newColor) => {
    setColor(newColor);
    colorRef.current = newColor;
  };

  return (
    <div className="flex flex-col gap-2">

      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <div className="flex items-center gap-2">
          {/* Color picker */}
          <div className="flex items-center gap-1">
            {COLORS.map(c => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => handleColorChange(c.value)}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  color === c.value ? "border-emerald-500 scale-125" : "border-transparent"
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
          {!isEmpty && (
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div
        className="relative rounded-xl border-2 border-dashed border-slate-300 bg-white overflow-hidden"
        style={{ height: "160px" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          style={{ cursor: "crosshair", display: "block" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
            <svg className="w-6 h-6 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <p className="text-xs text-slate-300 select-none font-medium">دستخط یہاں کریں</p>
          </div>
        )}
      </div>

    </div>
  );
}