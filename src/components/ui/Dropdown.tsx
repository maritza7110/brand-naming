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
      <label
        htmlFor={selectId}
        className="block text-[12px] font-medium text-[#505050] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-lg bg-[#111] text-[14px] leading-relaxed appearance-none cursor-pointer border border-[#222] transition-all duration-200 hover:border-[#333] focus:border-[#D4A853]/40 focus:bg-[#0F0F0F] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed pr-10 ${
            value === '' ? 'text-[#333]' : 'text-[#ccc]'
          }`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#444] pointer-events-none"
        />
      </div>
    </div>
  );
}
