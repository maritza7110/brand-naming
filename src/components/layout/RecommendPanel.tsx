interface RecommendPanelProps {
  children: React.ReactNode;
}

export function RecommendPanel({ children }: RecommendPanelProps) {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto border-l border-gray-200 bg-white">
      <div className="sticky top-0 z-10 px-8 py-6 backdrop-blur-xl bg-white/80 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          브랜드명 추천
        </h2>
      </div>
      <div className="px-8 py-6">{children}</div>
    </aside>
  );
}
