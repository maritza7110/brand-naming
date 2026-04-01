interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      <h2 className="text-[15px] font-semibold uppercase tracking-[0.08em] text-gray-400">
        {title}
      </h2>
      {description && (
        <p className="text-[13px] text-gray-400 mt-1">{description}</p>
      )}
    </div>
  );
}
