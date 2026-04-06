import type { GallerySortBy } from '../../types/gallery';

interface GallerySortTabsProps {
  activeSort: GallerySortBy;
  onSortChange: (sort: GallerySortBy) => void;
}

const TABS: { key: GallerySortBy; label: string }[] = [
  { key: 'latest', label: '최신순' },
  { key: 'popular', label: '인기순' },
];

export default function GallerySortTabs({ activeSort, onSortChange }: GallerySortTabsProps) {
  return (
    <div className="flex gap-0 border-b border-[#4A4440]">
      {TABS.map(({ key, label }) =>
        activeSort === key ? (
          <span
            key={key}
            className="px-4 py-2 text-[14px] text-[#B48C50] border-b-2 border-[#B48C50] cursor-default"
          >
            {label}
          </span>
        ) : (
          <button
            key={key}
            onClick={() => onSortChange(key)}
            className="px-4 py-2 text-[14px] text-[#A09890] cursor-pointer hover:text-[#E8E2DA] transition-colors duration-150"
          >
            {label}
          </button>
        )
      )}
    </div>
  );
}
