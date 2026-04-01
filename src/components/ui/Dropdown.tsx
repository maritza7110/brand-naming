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
        className="block text-[12px] font-semibold text-indigo-400/80 uppercase tracking-[0.05em] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl border-0 bg-indigo-50/40 text-[14px] leading-relaxed appearance-none cursor-pointer transition-all duration-300 ring-1 ring-indigo-100 hover:ring-indigo-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:shadow-lg focus:shadow-indigo-500/10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed pr-10 ${
            value === '' ? 'text-gray-300' : 'text-gray-900'
          }`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none"
        />
      </div>
    </div>
  );
}
