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

export function TextArea({ label, value, onChange, placeholder, rows = 2, disabled = false, id }: TextAreaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <div>
      <label htmlFor={textareaId} className="block text-[12px] font-medium text-[#8A8178] mb-1.5">{label}</label>
      <textarea id={textareaId} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-[#332F2C] text-[14px] text-[#E0D9D0] leading-relaxed placeholder:text-[#5A5550] border border-[#3E3A36] resize-none transition-all duration-200 hover:border-[#4A4640] focus:border-[#B48C50]/60 focus:bg-[#3A3632] focus:outline-none disabled:opacity-40" />
    </div>
  );
}
