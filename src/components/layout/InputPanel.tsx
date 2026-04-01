import { Settings } from 'lucide-react';

interface InputPanelProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
}

export function InputPanel({ children, onSettingsClick }: InputPanelProps) {
  return (
    <main className="overflow-y-auto h-screen scroll-smooth">
      <div className="max-w-2xl mx-auto px-8 pt-12 pb-20">
        {/* 히어로 */}
        <div className="relative mb-12">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#D4A853] mb-3">
                AI Brand Naming
              </p>
              <h1 className="text-[30px] font-bold tracking-[-0.03em] text-white leading-tight">
                브랜드 네이밍
              </h1>
              <p className="mt-3 text-[14px] text-[#505050] leading-relaxed">
                페르소나 항목을 채워가면 AI가 점점 정교한 브랜드명을 추천합니다
              </p>
            </div>
            <button
              type="button"
              onClick={onSettingsClick}
              className="p-2.5 rounded-xl border border-[#262626] text-[#505050] transition-all duration-200 hover:border-[#404040] hover:text-[#888]"
              aria-label="설정"
            >
              <Settings size={16} />
            </button>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-[#D4A853]/30 via-[#262626] to-transparent" />
        </div>

        <div className="space-y-6">{children}</div>
      </div>
    </main>
  );
}
