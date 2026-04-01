import { Settings } from 'lucide-react';

interface InputPanelProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
}

export function InputPanel({ children, onSettingsClick }: InputPanelProps) {
  return (
    <main className="overflow-y-auto h-screen scroll-smooth">
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* 타이틀 컨테이너 */}
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 px-8 py-8 text-white shadow-lg">
          <h1 className="text-[32px] font-bold tracking-[-0.03em]">
            브랜드 네이밍
          </h1>
          <p className="mt-2 text-[15px] text-blue-200">
            페르소나 항목을 채워가며 AI 브랜드명을 추천받으세요
          </p>
          <button
            type="button"
            onClick={onSettingsClick}
            className="absolute bottom-4 right-4 p-2 rounded-lg text-blue-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
            aria-label="설정"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
