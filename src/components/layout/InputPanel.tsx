import { Settings, RotateCcw } from 'lucide-react';

interface InputPanelProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
  onResetClick?: () => void;
}

export function InputPanel({ children, onSettingsClick, onResetClick }: InputPanelProps) {
  return (
    <main className="overflow-y-auto h-screen scroll-smooth bg-[#2C2825]">
      <div className="max-w-[640px] mx-auto px-8 pt-12 pb-20">
        {/* 히어로 — 살짝 밝은 톤 */}
        <div className="relative rounded-2xl bg-[#363230] px-8 py-9 mb-10">
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B48C50] mb-2">
                Brand Naming
              </p>
              <h1 className="text-[26px] font-bold tracking-[-0.03em] text-[#F0EBE3]">
                브랜드 네이밍
              </h1>
              <p className="mt-2 text-[13px] text-[#A09890] leading-relaxed">
                페르소나 항목을 채워가면 AI가 점점 정교한 브랜드명을 추천합니다
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={onSettingsClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#A09890] text-[11px] font-medium transition hover:text-[#B48C50] hover:bg-[#504A44]"
              >
                <span>API설정</span>
                <Settings size={14} />
              </button>
              {onResetClick && (
                <button
                  type="button"
                  onClick={onResetClick}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#A09890] text-[11px] font-medium transition hover:text-red-400 hover:bg-[#504A44]"
                >
                  <RotateCcw size={14} />
                  <span>네이밍 초기화</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">{children}</div>
      </div>
    </main>
  );
}
