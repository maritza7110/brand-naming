import type { TabId } from '../../types/form';

interface Tab {
  id: TabId;
  label: string;
  ariaLabel: string;
}

const TABS: Tab[] = [
  { id: 'analysis', label: '분석', ariaLabel: '분석 탭 — 시장 환경' },
  { id: 'identity', label: '정체성', ariaLabel: '정체성 탭 — 브랜드 내부' },
  { id: 'persona', label: '페르소나', ariaLabel: '페르소나 탭 — 브랜드 성격' },
  { id: 'expression', label: '표현', ariaLabel: '표현 탭 — 네이밍 출력' },
];

interface WizardTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function WizardTabs({ activeTab, onTabChange }: WizardTabsProps) {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % TABS.length;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = TABS.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    onTabChange(TABS[nextIndex].id);
    const buttons = (e.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons[nextIndex]?.focus();
  };

  return (
    <div
      role="tablist"
      className="relative flex border-b border-[var(--color-border)] bg-[var(--color-bg)]"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={tab.ariaLabel}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 h-[44px] text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-[-2px] ${
              isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
      {/* 슬라이딩 인디케이터 */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 h-[2px] bg-[var(--color-accent)]"
        style={{
          width: `${100 / TABS.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
          transition: 'transform 300ms ease-in-out',
        }}
      />
    </div>
  );
}
