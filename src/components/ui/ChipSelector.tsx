import { useState } from 'react';

interface ChipSelectorProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelection: number;
  hint?: string;
}

export function ChipSelector({
  label,
  options,
  selected,
  onChange,
  maxSelection,
  hint,
}: ChipSelectorProps) {
  const [pressing, setPressing] = useState<string | null>(null);

  function handleToggle(option: string) {
    if (selected.includes(option)) {
      // 해제
      onChange(selected.filter((s) => s !== option));
    } else {
      // 선택 — 최대 초과 시 FIFO: 가장 먼저 선택된 항목 해제
      const next =
        selected.length >= maxSelection
          ? [...selected.slice(1), option]
          : [...selected, option];
      onChange(next);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent, option: string) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle(option);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[14px] font-semibold text-[#5A5550]">{label}</span>
        {hint && (
          <span className="text-[12px] text-[var(--color-text-muted)]">{hint}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-[8px]">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const isPressing = pressing === option;
          return (
            <button
              key={option}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => handleToggle(option)}
              onKeyDown={(e) => handleKeyDown(e, option)}
              onMouseDown={() => setPressing(option)}
              onMouseUp={() => setPressing(null)}
              onMouseLeave={() => setPressing(null)}
              style={{
                transform: isPressing ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 100ms ease, background-color 150ms ease, border-color 150ms ease',
              }}
              className={`px-3 py-1.5 text-[14px] font-semibold rounded-lg border cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                isSelected
                  ? 'bg-[rgba(180,140,80,0.15)] text-[var(--color-accent)] border-[var(--color-accent)]'
                  : 'bg-[var(--color-border)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
