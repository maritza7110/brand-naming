import { useId } from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  id?: string;
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
  disabled = false,
  id,
}: TextAreaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <div>
      <label htmlFor={textareaId} className="block text-[12px] font-semibold text-[#8A8580] mb-1.5">
        {label}
      </label>
      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-[#F6F4F0] text-[14px] text-[#2C2825] leading-relaxed placeholder:text-[#C5C0BA] border border-[#E0DBD4] resize-none transition-all duration-200 hover:border-[#C5BFB7] focus:bg-white focus:border-[#B48C50] focus:shadow-[0_0_0_3px_rgba(180,140,80,0.08)] focus:outline-none disabled:opacity-40"
      />
    </div>
  );
}
