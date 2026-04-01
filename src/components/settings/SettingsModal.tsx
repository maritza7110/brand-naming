import { useState, useRef } from 'react';
import { X, Eye, EyeOff, Upload, FileText, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { parseDocument } from '../../services/documentParser';

interface Props { open: boolean; onClose: () => void; }

export function SettingsModal({ open, onClose }: Props) {
  const apiKey = useSettingsStore((s) => s.apiKey);
  const setApiKey = useSettingsStore((s) => s.setApiKey);
  const documents = useSettingsStore((s) => s.documents);
  const addDocument = useSettingsStore((s) => s.addDocument);
  const removeDocument = useSettingsStore((s) => s.removeDocument);
  const [showKey, setShowKey] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'txt' && ext !== 'pdf') { alert('txt 또는 pdf 파일만 업로드 가능합니다.'); return; }
    setUploading(true);
    try { addDocument(await parseDocument(file)); } catch { alert('파일을 읽을 수 없습니다.'); }
    finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg rounded-2xl bg-[#332F2C] border border-[#3E3A36] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#3E3A36]">
          <h2 className="text-[16px] font-bold text-[#D5CDC4]">설정</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#6A6158] hover:bg-[#3E3A36] hover:text-[#B48C50] transition-colors"><X size={16} /></button>
        </div>
        <div className="px-6 py-6 space-y-7">
          <section>
            <label className="block text-[12px] font-semibold text-[#8A8178] mb-2">Gemini API 키</label>
            <div className="relative">
              <input type={showKey ? 'text' : 'password'} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API 키를 입력하세요"
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#2C2825] border border-[#3E3A36] text-[14px] text-[#E0D9D0] placeholder:text-[#5A5550] transition-all hover:border-[#4A4640] focus:border-[#B48C50]/60 focus:outline-none" />
              <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A6158] hover:text-[#B48C50]">
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-[#6A6158]">브라우저 로컬스토리지에 저장됩니다</p>
          </section>
          <section>
            <label className="block text-[12px] font-semibold text-[#8A8178] mb-2">지침 문서</label>
            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-2 py-6 rounded-xl border border-dashed border-[#4A4640] cursor-pointer transition-colors hover:border-[#B48C50]/40 hover:bg-[#B48C50]/5">
              <Upload size={18} className="text-[#6A6158]" />
              <span className="text-[12px] text-[#8A8178]">{uploading ? '업로드 중...' : 'txt, pdf 파일을 드래그하거나 클릭'}</span>
            </div>
            <input ref={fileRef} type="file" accept=".txt,.pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} className="hidden" />
            {documents.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#2C2825] border border-[#3A3632]">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={14} className="flex-shrink-0 text-[#6A6158]" />
                      <span className="text-[12px] text-[#B5ADA4] truncate">{doc.name}</span>
                      <span className="text-[10px] text-[#6A6158] flex-shrink-0">{Math.round(doc.content.length / 1000)}k자</span>
                    </div>
                    <button onClick={() => removeDocument(doc.id)} className="p-1 rounded text-[#6A6158] hover:text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 size={12} /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
