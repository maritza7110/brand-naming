interface RecommendPanelProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export function RecommendPanel({ children, headerRight }: RecommendPanelProps) {
  return (
    <aside className="static lg:sticky lg:top-0 h-auto lg:h-screen overflow-visible lg:overflow-y-auto bg-[#252220] border-t lg:border-t-0 lg:border-l border-[#4A4440] min-h-[300px] lg:min-h-0">
      <div className="sticky top-0 z-10 px-6 pt-7 pb-4 bg-[#252220]/90 backdrop-blur-md border-b border-[#4A4440]">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-bold tracking-[0.15em] uppercase text-[#B48C50]">
            추천 결과
          </h2>
          {headerRight}
        </div>
      </div>
      <div className="px-6 pb-6 pt-3">{children}</div>
    </aside>
  );
}
