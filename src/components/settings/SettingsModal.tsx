import { useState, useRef } from 'react';
import { X, Eye, EyeOff, Upload, FileText, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { parseDocument } from '../../services/documentParser';

interface Props {
  open: boolean;
  onClose: () => void;
}

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
    if (ext !== 'txt' && ext !== 'pdf') {
      alert('txt 또는 pdf 파일만 업로드 가능합니다.');
      return;
    }
    setUploading(true);
    try {
      const doc = await parseDocument(file);
      addDocument(doc);
    } catch {
      alert('파일을 읽을 수 없습니다.');
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-[18px] font-semibold text-gray-900">설정</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* API 키 */}
          <section>
            <label className="block text-[14px] font-medium text-gray-900 mb-2">
              Gemini API 키
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API 키를 입력하세요"
                className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 text-[14px] transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="mt-1.5 text-[12px] text-gray-400">
              브라우저 로컬스토리지에 저장됩니다
            </p>
          </section>

          {/* 지침 문서 업로드 */}
          <section>
            <label className="block text-[14px] font-medium text-gray-900 mb-2">
              지침 문서
            </label>
            <p className="text-[12px] text-gray-500 mb-3">
              브랜딩 가이드, 네이밍 규칙 등을 업로드하면 AI가 참고합니다
            </p>

            {/* 드래그 앤 드롭 영역 */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center gap-2 py-6 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer transition-colors hover:border-blue-400 hover:bg-blue-50/50"
            >
              <Upload size={20} className="text-gray-400" />
              <span className="text-[13px] text-gray-500">
                {uploading ? '업로드 중...' : 'txt, pdf 파일을 드래그하거나 클릭'}
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.pdf"
              onChange={onFileChange}
              className="hidden"
            />

            {/* 업로드된 문서 목록 */}
            {documents.length > 0 && (
              <ul className="mt-3 space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="flex-shrink-0 text-gray-400" />
                      <span className="text-[13px] text-gray-700 truncate">
                        {doc.name}
                      </span>
                      <span className="text-[11px] text-gray-400 flex-shrink-0">
                        {Math.round(doc.content.length / 1000)}k자
                      </span>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
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
