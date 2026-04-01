import { Settings } from 'lucide-react';

interface InputPanelProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
}

export function InputPanel({ children, onSettingsClick }: InputPanelProps) {
  return (
    <main className="overflow-y-auto h-screen scroll-smooth bg-[#F6F4F0]">
      <div className="max-w-[640px] mx-auto px-8 pt-12 pb-20">
        {/* 히어로 */}
        <div className="relative rounded-2xl bg-[#2C2825] px-8 py-9 mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#B48C50]/10 rounded-full blur-3xl" />
          <div className="relative">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B48C50] mb-2">
              Brand Naming
            </p>
            <h1 className="text-[26px] font-bold tracking-[-0.03em] text-white">
              브랜드 네이밍
            </h1>
            <p className="mt-2 text-[13px] text-[#9A9590] leading-relaxed">
              페르소나 항목을 채워가면 AI가 점점 정교한 브랜드명을 추천합니다
            </p>
          </div>
          <button
            type="button"
            onClick={onSettingsClick}
            className="absolute top-6 right-6 p-2 rounded-lg text-[#9A9590] transition hover:text-white hover:bg-white/10"
            aria-label="설정"
          >
            <Settings size={16} />
          </button>
        </div>

        <div className="space-y-5">{children}</div>
      </div>
    </main>
  );
}
