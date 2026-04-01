import { Settings } from 'lucide-react';

interface InputPanelProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
}

export function InputPanel({ children, onSettingsClick }: InputPanelProps) {
  return (
    <main className="overflow-y-auto h-screen scroll-smooth">
      <div className="max-w-2xl mx-auto px-8 py-10">
        {/* 타이틀 */}
        <div className="relative mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[24px] font-bold tracking-[-0.03em] text-gray-900">
                브랜드 네이밍
              </h1>
              <p className="mt-1 text-[13px] text-gray-400">
                항목을 채워가며 AI 브랜드명을 추천받으세요
              </p>
            </div>
            <button
              type="button"
              onClick={onSettingsClick}
              className="p-2 rounded-lg text-gray-300 transition-all duration-200 hover:bg-gray-100 hover:text-gray-500"
              aria-label="설정"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </main>
  );
}
