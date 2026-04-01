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
      <label
        htmlFor={textareaId}
        className="block text-[12px] font-medium text-[#505050] mb-1.5"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg bg-[#111] text-[14px] text-[#ccc] leading-relaxed placeholder:text-[#333] border border-[#222] resize-none transition-all duration-200 hover:border-[#333] focus:border-[#D4A853]/40 focus:bg-[#0F0F0F] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
