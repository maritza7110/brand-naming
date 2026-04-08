import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function Dropdown({ label, value, onChange, options, placeholder = '선택', disabled = false, id }: DropdownProps) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div>
      <label htmlFor={selectId} className="block text-[14px] font-semibold text-[#5A5550] mb-1.5">{label}</label>
      <div className="relative">
        <select id={selectId} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-[#F5F3F0] text-[15px] leading-relaxed appearance-none cursor-pointer border border-[#C5BFB7] transition-all duration-200 hover:border-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:bg-white focus:outline-none disabled:opacity-40 pr-10 ${
            value === '' ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-bg)]'
          }`}>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A5550] pointer-events-none" />
      </div>
    </div>
  );
}
