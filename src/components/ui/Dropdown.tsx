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
  placeholder = '선택하세요',
  disabled = false,
  id,
}: DropdownProps) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-[13px] font-medium text-gray-500 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 rounded-lg border border-gray-200/80 bg-gray-50/50 text-[14px] leading-relaxed appearance-none cursor-pointer transition-all duration-200 hover:border-gray-300 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed pr-10 ${
            value === '' ? 'text-gray-300' : 'text-gray-900'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
        />
      </div>
    </div>
  );
}
