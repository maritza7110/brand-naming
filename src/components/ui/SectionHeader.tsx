interface SectionHeaderProps {
  title: string;
  icon?: string;
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {icon && <span className="text-[14px] grayscale opacity-40">{icon}</span>}
      <h2 className="text-[14px] font-semibold text-[#888] tracking-[-0.01em]">
        {title}
      </h2>
      <div className="flex-1 h-px bg-[#222]" />
    </div>
  );
}
