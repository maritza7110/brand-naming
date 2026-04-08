import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';

interface Props { open: boolean; onClose: () => void; }

export function SettingsModal({ open, onClose }: Props) {
  const apiKey = useSettingsStore((s) => s.apiKey);
  const setApiKey = useSettingsStore((s) => s.setApiKey);
  const [showKey, setShowKey] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-[#3E3A36] border border-[#4A4640] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#504A44]">
          <h2 className="text-[16px] font-bold text-[var(--color-text-primary)]">설정</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[#504A44] hover:text-[var(--color-accent)] transition-colors"><X size={16} /></button>
        </div>
        <div className="px-6 py-6">
          <label className="block text-[12px] font-semibold text-[var(--color-text-muted)] mb-2">Gemini API 키</label>
          <div className="relative">
            <input type={showKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API 키를 입력하세요"
              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[14px] text-[#F0EBE3] placeholder:text-[#7A7570] transition-all hover:border-[#5A5650] focus:border-[var(--color-accent)]/60 focus:outline-none" />
            <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)]">
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-[var(--color-text-muted)]">브라우저 로컬스토리지에 저장됩니다</p>
        </div>
      </div>
    </div>
  );
}
