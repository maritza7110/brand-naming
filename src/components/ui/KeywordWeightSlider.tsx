interface KeywordWeightSliderProps {
  keywords: { label: string; weight: number }[];
  onChange: (keyword: string, weight: number) => void;
}

export function KeywordWeightSlider({ keywords, onChange }: KeywordWeightSliderProps) {
  if (keywords.length === 0) return null;

  return (
    <div>
      <style>{`
        .kw-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 16px;
          background: transparent;
          outline: none;
          cursor: pointer;
          padding: 0;
          margin: 0;
        }
        .kw-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #F5F0E8;
          border: 2px solid var(--color-accent);
          box-shadow: 0 0 0 3px rgba(180, 140, 80, 0.25);
          cursor: pointer;
          margin-top: -5px;
        }
        .kw-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border: 2px solid var(--color-accent);
          border-radius: 50%;
          background: #F5F0E8;
          box-shadow: 0 0 0 3px rgba(180, 140, 80, 0.25);
          cursor: pointer;
        }
        .kw-slider::-webkit-slider-runnable-track {
          background: linear-gradient(
            to right,
            var(--color-accent) calc(var(--fill) * 1%),
            var(--color-border) calc(var(--fill) * 1%)
          );
          height: 4px;
          border-radius: 2px;
        }
        .kw-slider::-moz-range-track {
          background: linear-gradient(
            to right,
            var(--color-accent) calc(var(--fill) * 1%),
            var(--color-border) calc(var(--fill) * 1%)
          );
          height: 4px;
          border-radius: 2px;
        }
      `}</style>
      <p className="text-[14px] font-semibold text-[#5A5550] mb-2">키워드 가중치</p>
      <div className="max-h-[200px] overflow-y-auto space-y-1">
        {keywords.map(({ label, weight }) => {
          const fillPercent = ((weight - 1) / 4) * 100;
          return (
            <div key={label} className="flex items-center gap-3 py-1.5">
              <span className="text-[14px] text-[var(--color-text-secondary)] truncate shrink-0 text-right w-24">
                {label}
              </span>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={weight}
                aria-label={`${label} 가중치`}
                onChange={(e) => onChange(label, Number(e.target.value))}
                className="kw-slider flex-1"
                style={{ '--fill': fillPercent } as React.CSSProperties}
              />
              <span className="text-[12px] font-semibold text-[var(--color-accent)] w-[20px] text-right">
                {weight}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
