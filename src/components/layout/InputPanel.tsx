import { Settings, RotateCcw, User, Layout } from 'lucide-react';

interface InputPanelProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
  onResetClick?: () => void;
  onAuthClick?: () => void;
  authLabel?: string;
  isLoggedIn?: boolean;
  tabBar?: React.ReactNode;
}

export function InputPanel({
  children,
  onSettingsClick,
  onResetClick,
  onAuthClick,
  authLabel = '로그인',
  isLoggedIn = false,
  tabBar,
}: InputPanelProps) {
  return (
    <main className="overflow-visible lg:overflow-y-auto h-auto lg:h-screen scroll-smooth bg-[#2C2825]">
      <div className="max-w-none lg:max-w-[640px] mx-auto px-5 lg:px-8 pt-6 lg:pt-12 pb-8 lg:pb-20">
        {/* 히어로 — 살짝 밝은 톤 */}
        <div className="relative rounded-2xl bg-[#363230] px-5 lg:px-8 py-6 lg:py-8 mb-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[13px] font-semibold tracking-[0.25em] uppercase text-[#B48C50]">
                  Brand Naming
                </p>
                {onAuthClick && (
                  <button
                    onClick={onAuthClick}
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#B48C50]/10 text-[#B48C50] text-[11px] font-bold hover:bg-[#B48C50]/20 transition-colors"
                  >
                    {isLoggedIn ? <Layout size={12} /> : <User size={12} />}
                    <span>{authLabel}</span>
                  </button>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-semibold tracking-[-0.03em] text-[#F0EBE3]">
                브랜드 네이밍
              </h1>
            </div>
            <div className="flex flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={onSettingsClick}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#C5BFB7] text-[13px] font-medium transition hover:text-[#B48C50] hover:bg-[#504A44] whitespace-nowrap"
              >
                <span>API설정</span>
                <Settings size={16} />
              </button>
              {onResetClick && (
                <button
                  type="button"
                  onClick={onResetClick}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#C5BFB7] text-[13px] font-medium transition hover:text-red-400 hover:bg-[#504A44] whitespace-nowrap"
                >
                  <RotateCcw size={16} />
                  <span>네이밍 초기화</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#4A4440]">
            <p className="text-[15px] text-[#D0CAC2] leading-relaxed">
              페르소나 항목을 채워가면 AI가 점점 정교한 브랜드명을 추천합니다
            </p>
          </div>
        </div>

        {tabBar && (
          <div className="sticky top-0 z-10 bg-[#2C2825] -mx-5 lg:-mx-8 px-5 lg:px-8 mb-5">
            {tabBar}
          </div>
        )}

        <div className="space-y-5">{children}</div>
      </div>
    </main>
  );
}
