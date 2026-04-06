import { useId } from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  id?: string;
  labelAction?: React.ReactNode;
}

export function TextArea({ label, value, onChange, placeholder, rows = 2, disabled = false, id, labelAction }: TextAreaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={textareaId} className="block text-[14px] font-semibold text-[#5A5550]">{label}</label>
        {labelAction && <div>{labelAction}</div>}
      </div>
      <textarea id={textareaId} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled}
        className="w-full px-4 py-3 rounded-xl bg-[#F5F3F0] text-[15px] text-[#2C2825] leading-relaxed placeholder:text-[#A09890] border border-[#C5BFB7] resize-none transition-all duration-200 hover:border-[#A09890] focus:border-[#B48C50] focus:bg-white focus:outline-none disabled:opacity-40" />
    </div>
  );
}
