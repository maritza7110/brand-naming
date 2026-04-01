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
      <label htmlFor={selectId} className="block text-[12px] font-medium text-[#8A8178] mb-1.5">{label}</label>
      <div className="relative">
        <select id={selectId} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl bg-[#332F2C] text-[14px] leading-relaxed appearance-none cursor-pointer border border-[#3E3A36] transition-all duration-200 hover:border-[#4A4640] focus:border-[#B48C50]/60 focus:bg-[#3A3632] focus:outline-none disabled:opacity-40 pr-10 ${
            value === '' ? 'text-[#5A5550]' : 'text-[#E0D9D0]'
          }`}>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6A6158] pointer-events-none" />
      </div>
    </div>
  );
}
