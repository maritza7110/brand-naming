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
      <label htmlFor={textareaId} className="block text-[12px] font-medium text-[#A09890] mb-1.5">{label}</label>
      <textarea id={textareaId} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-[#332F2C] text-[14px] text-[#F0EBE3] leading-relaxed placeholder:text-[#7A7570] border border-[#504A44] resize-none transition-all duration-200 hover:border-[#5A5650] focus:border-[#B48C50]/60 focus:bg-[#4A4440] focus:outline-none disabled:opacity-40" />
    </div>
  );
}
