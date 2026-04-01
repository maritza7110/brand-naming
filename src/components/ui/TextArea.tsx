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
      <label htmlFor={textareaId} className="block text-[12px] font-semibold text-[#5A5550] mb-1.5">{label}</label>
      <textarea id={textareaId} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-[#F5F3F0] text-[14px] text-[#2C2825] leading-relaxed placeholder:text-[#B5AFA8] border border-[#4A4640] resize-none transition-all duration-200 hover:border-[#A09890] focus:border-[#B48C50] focus:bg-[#504A44] focus:outline-none disabled:opacity-40" />
    </div>
  );
}
