interface RecommendPanelProps {
  children: React.ReactNode;
}

export function RecommendPanel({ children }: RecommendPanelProps) {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto border-l border-gray-100 bg-gray-50/60">
      <div className="sticky top-0 z-10 px-6 py-5 bg-gray-50/80 backdrop-blur-md">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-400">
          추천 결과
        </h2>
      </div>
      <div className="px-6 pb-6">{children}</div>
    </aside>
  );
}
