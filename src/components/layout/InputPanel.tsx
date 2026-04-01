import { Settings } from 'lucide-react';

interface InputPanelProps {
  children: React.ReactNode;
  onSettingsClick?: () => void;
}

export function InputPanel({ children, onSettingsClick }: InputPanelProps) {
  return (
    <main className="overflow-y-auto h-screen scroll-smooth">
      <div className="max-w-2xl mx-auto px-8 pt-10 pb-16">
        {/* 히어로 헤더 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-8 py-10 shadow-xl shadow-indigo-500/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-60" />
          <div className="relative">
            <p className="text-indigo-200 text-[12px] font-semibold tracking-[0.15em] uppercase mb-2">
              AI Brand Naming
            </p>
            <h1 className="text-[28px] font-bold tracking-[-0.03em] text-white">
              브랜드 네이밍
            </h1>
            <p className="mt-2 text-[14px] text-indigo-200/80 leading-relaxed">
              페르소나 항목을 채워가면 AI가 점점 정교한 브랜드명을 추천합니다
            </p>
          </div>
          <button
            type="button"
            onClick={onSettingsClick}
            className="absolute top-5 right-5 p-2.5 rounded-xl bg-white/10 text-white/60 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white"
            aria-label="설정"
          >
            <Settings size={18} />
          </button>
        </div>

        <div className="mt-8 space-y-5">{children}</div>
      </div>
    </main>
  );
}
