interface InputPanelProps {
  children: React.ReactNode;
}

export function InputPanel({ children }: InputPanelProps) {
  return (
    <main className="overflow-y-auto h-screen scroll-smooth">
      <div className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-gray-900">
          브랜드 네이밍
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          페르소나 항목을 채워가며 AI 브랜드명을 추천받으세요
        </p>
        <div className="mt-12">{children}</div>
      </div>
    </main>
  );
}
