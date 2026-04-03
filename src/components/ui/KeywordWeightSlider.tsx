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
          height: 4px;
          border-radius: 2px;
          background: #4A4440;
          outline: none;
          cursor: pointer;
        }
        .kw-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #B48C50;
          box-shadow: 0 0 0 4px rgba(180, 140, 80, 0.2);
          cursor: pointer;
        }
        .kw-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 50%;
          background: #B48C50;
          box-shadow: 0 0 0 4px rgba(180, 140, 80, 0.2);
          cursor: pointer;
        }
        .kw-slider::-webkit-slider-runnable-track {
          background: linear-gradient(
            to right,
            #B48C50 calc(var(--fill) * 1%),
            #4A4440 calc(var(--fill) * 1%)
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
              <span
                className="text-[14px] text-[#D0CAC2] truncate"
                style={{ maxWidth: '120px' }}
              >
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
              <span className="text-[12px] font-semibold text-[#B48C50] w-[20px] text-right">
                {weight}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
