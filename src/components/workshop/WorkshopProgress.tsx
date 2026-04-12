/**
 * WorkshopProgress Component
 * 심층 기획 워크숍의 진행률 표시 헤더
 */
import { Sparkles } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { PERSONA_FIELD_METADATA } from '../../types/workshop';

export function WorkshopProgress() {
  const builderState = useFormStore((s) => s.builderState);
  
  const completedCount = PERSONA_FIELD_METADATA.filter(
    f => builderState[f.key]?.isFinalized
  ).length;
  const totalCount = PERSONA_FIELD_METADATA.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="sticky top-16 z-20 bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)] mb-6 px-4 py-4 rounded-b-2xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--color-text-primary)]">
          <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
          브랜드 페르소나 워크숍
        </h2>
        <span className="text-sm font-bold text-[var(--color-accent)]">{progress}% 완성</span>
      </div>
      <div className="w-full bg-[var(--color-border)] rounded-full h-2">
        <div 
          className="bg-[var(--color-accent)] h-2 rounded-full transition-all duration-500" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
