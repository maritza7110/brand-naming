interface SectionHeaderProps {
  title: string;
  icon?: string;
}

export function SectionHeader({ title, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2.5 mb-6">
      {icon && <span className="text-[16px]">{icon}</span>}
      <h2 className="text-[16px] font-bold text-gray-800 tracking-[-0.01em]">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-indigo-200/60 to-transparent" />
    </div>
  );
}
