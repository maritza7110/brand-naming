import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export function SectionHeader({ title, subtitle, icon: Icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[var(--color-text-secondary)]">
      {Icon ? (
        <Icon size={16} className="text-[var(--color-accent)] shrink-0" />
      ) : (
        <div className="w-1 h-4 rounded-full bg-[var(--color-accent)]" />
      )}
      <div>
        {subtitle && (
          <span className="block text-[12px] font-semibold text-[#6B6560] leading-[1.4]">
            {subtitle}
          </span>
        )}
        <h2 className="text-[14px] font-semibold text-[var(--color-bg)]">{title}</h2>
      </div>
    </div>
  );
}
