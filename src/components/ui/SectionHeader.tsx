interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#3E3A36]">
      <div className="w-1 h-4 rounded-full bg-[#B48C50]" />
      <h2 className="text-[14px] font-bold text-[#D5CDC4]">{title}</h2>
    </div>
  );
}
