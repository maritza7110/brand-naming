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
        className="block text-[12px] font-semibold text-indigo-400/80 uppercase tracking-[0.05em] mb-1.5"
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
        className="w-full px-4 py-3 rounded-xl border-0 bg-indigo-50/40 text-[14px] leading-relaxed placeholder:text-gray-300 resize-none transition-all duration-300 ring-1 ring-indigo-100 hover:ring-indigo-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:shadow-lg focus:shadow-indigo-500/10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
