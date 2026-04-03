import type { TabId } from '../../types/form';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'analysis', label: '분석' },
  { id: 'identity', label: '정체성' },
  { id: 'expression', label: '표현' },
];

interface WizardTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function WizardTabs({ activeTab, onTabChange }: WizardTabsProps) {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <div className="relative flex border-b border-[#4A4440] bg-[#2C2825]">
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 h-[44px] text-[14px] font-semibold transition-colors ${
              isActive ? 'text-[#B48C50]' : 'text-[#A09890] hover:text-[#D0CAC2]'
            }`}
            aria-selected={isActive}
            role="tab"
          >
            {tab.label}
          </button>
        );
      })}
      {/* 슬라이딩 인디케이터 */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 h-[2px] bg-[#B48C50]"
        style={{
          width: `${100 / 3}%`,
          transform: `translateX(${activeIndex * 100}%)`,
          transition: 'transform 300ms ease-in-out',
        }}
      />
    </div>
  );
}
