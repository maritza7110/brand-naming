interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div>
      <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-gray-900">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
}
