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
  rows = 3,
  disabled = false,
  id,
}: TextAreaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <div>
      <label
        htmlFor={textareaId}
        className="block text-[14px] font-medium text-gray-900 mb-2"
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
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-[15px] leading-relaxed placeholder:text-gray-400 resize-none transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
      />
    </div>
  );
}
