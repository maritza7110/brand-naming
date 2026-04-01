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
        className="block text-[13px] font-medium text-gray-500 mb-1.5"
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
        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200/80 bg-gray-50/50 text-[14px] leading-relaxed placeholder:text-gray-300 resize-none transition-all duration-200 hover:border-gray-300 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
