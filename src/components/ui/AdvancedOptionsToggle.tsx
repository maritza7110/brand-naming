import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AdvancedOptionsToggleProps {
  children: React.ReactNode;
}

export function AdvancedOptionsToggle({ children }: AdvancedOptionsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-[14px] font-semibold text-[#A09890] hover:text-[#B48C50] cursor-pointer transition-colors duration-150"
        aria-expanded={isOpen}
      >
        <span>고급 옵션</span>
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
          }}
        />
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 200ms ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="pt-3 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
