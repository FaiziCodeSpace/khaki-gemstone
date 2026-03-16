// MarginControl.jsx
// Controls: top margin, font size, left/right padding
// All values feed directly into ContractTemplate

const Slider = ({ label, value, min, max, step, unit, onChange, badge }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
          {value}{unit}
        </span>
        {badge && (
          <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-lg">
            {badge}
          </span>
        )}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-600 bg-slate-200"
    />
  </div>
);

export default function MarginControl({
  topMargin,    onTopMargin,
  fontSize,     onFontSize,
  paddingH,     onPaddingH,
  canvasHeight,
}) {
  const percentage = canvasHeight
    ? Math.round((topMargin / canvasHeight) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-5 bg-slate-50 border border-slate-200 rounded-xl p-4">

      <Slider
        label="Top Margin"
        value={topMargin}
        min={0}
        max={canvasHeight || 1000}
        step={5}
        unit="px"
        badge={`${percentage}%`}
        onChange={onTopMargin}
      />

      <Slider
        label="Font Size"
        value={fontSize}
        min={8}
        max={22}
        step={0.5}
        unit="px"
        onChange={onFontSize}
      />

      <Slider
        label="Side Padding"
        value={paddingH}
        min={20}
        max={200}
        step={2}
        unit="px"
        onChange={onPaddingH}
      />

      <div className="flex justify-between text-xs text-slate-400 -mt-2">
        <span>↑ Top of page</span>
        <span>↑ Smaller text</span>
        <span>↑ Less padding</span>
      </div>
    </div>
  );
}