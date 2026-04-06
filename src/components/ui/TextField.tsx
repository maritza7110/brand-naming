import { useId } from 'react';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  labelAction?: React.ReactNode;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  id,
  labelAction,
}: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={inputId}
          className="block text-[14px] font-semibold text-[#5A5550]"
        >
          {label}
        </label>
        {labelAction && <div>{labelAction}</div>}
      </div>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-[#F5F3F0] text-[15px] text-[#2C2825] leading-relaxed placeholder:text-[#A09890] border border-[#C5BFB7] transition-all duration-200 hover:border-[#A09890] focus:border-[#B48C50] focus:bg-white focus:outline-none disabled:opacity-40"
      />
    </div>
  );
}
