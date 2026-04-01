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

export function Dropdown({
  label,
  value,
  onChange,
  options,
  placeholder = '선택',
  disabled = false,
  id,
}: DropdownProps) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div>
      <label htmlFor={selectId} className="block text-[12px] font-semibold text-[#8A8580] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-[#F6F4F0] text-[14px] leading-relaxed appearance-none cursor-pointer border border-[#E0DBD4] transition-all duration-200 hover:border-[#C5BFB7] focus:bg-white focus:border-[#B48C50] focus:shadow-[0_0_0_3px_rgba(180,140,80,0.08)] focus:outline-none disabled:opacity-40 pr-10 ${
            value === '' ? 'text-[#C5C0BA]' : 'text-[#2C2825]'
          }`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#B5AFA8] pointer-events-none" />
      </div>
    </div>
  );
}
