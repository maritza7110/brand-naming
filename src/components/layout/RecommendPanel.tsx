interface RecommendPanelProps {
  children: React.ReactNode;
}

export function RecommendPanel({ children }: RecommendPanelProps) {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto bg-white/70 backdrop-blur-xl border-l border-indigo-100/50">
      <div className="sticky top-0 z-10 px-6 pt-6 pb-4 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 animate-pulse" />
          <h2 className="text-[13px] font-bold tracking-[0.05em] uppercase text-indigo-900/60">
            추천 결과
          </h2>
        </div>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </aside>
  );
}
