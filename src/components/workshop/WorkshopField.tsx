/**
 * WorkshopField Component
 * 심층 기획 워크숍의 단일 필드 아코디언
 */
import { useState } from 'react';
import { ChevronRight, Check, Sparkles, Lightbulb } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { PERSONA_FIELD_METADATA } from '../../types/workshop';
import type { PersonaFieldKey } from '../../types/workshop';
import { generateFieldDraft } from '../../services/workshopService';

interface WorkshopFieldProps {
  fieldKey: PersonaFieldKey;
}

export function WorkshopField({ fieldKey }: WorkshopFieldProps) {
  const fieldMeta = PERSONA_FIELD_METADATA.find(f => f.key === fieldKey)!;
  const fieldState = useFormStore((s) => s.builderState[fieldKey]);
  const expandedField = useFormStore((s) => s.expandedField);
  const setExpandedField = useFormStore((s) => s.setExpandedField);
  const setFieldDraft = useFormStore((s) => s.setFieldDraft);
  const setFieldLoading = useFormStore((s) => s.setFieldLoading);
  const finalizeField = useFormStore((s) => s.finalizeField);
  const resetField = useFormStore((s) => s.resetField);
  const guides = useFormStore((s) => s.guides[fieldKey]);
  const storeBasic = useFormStore((s) => s.storeBasic);
  
  const [userInput, setUserInput] = useState(fieldState?.userInput || '');
  const isOpen = expandedField === fieldKey;
  const isDone = fieldState?.isFinalized;
  const isLoading = fieldState?.isLoading;

  const handleExpand = () => {
    if (isOpen) {
      setExpandedField(null);
    } else {
      setExpandedField(fieldKey);
      setUserInput(fieldState?.userInput || '');
    }
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setFieldLoading(fieldKey, true);
    try {
      // Build context from other finalized fields
      const builderState = useFormStore.getState().builderState;
      const context = PERSONA_FIELD_METADATA
        .filter(f => builderState[f.key]?.isFinalized && builderState[f.key]?.draft)
        .map(f => `[${f.label}]: ${builderState[f.key].draft}`)
        .join('\n');

      const draft = await generateFieldDraft(
        fieldKey,
        storeBasic.mainProduct || '브랜드',
        userInput,
        context,
        storeBasic.industry,
        undefined
      );

      setFieldDraft(fieldKey, draft);
      finalizeField(fieldKey);

      // Auto-advance to next field
      const currentIndex = PERSONA_FIELD_METADATA.findIndex(f => f.key === fieldKey);
      if (currentIndex < PERSONA_FIELD_METADATA.length - 1) {
        const nextField = PERSONA_FIELD_METADATA[currentIndex + 1];
        setTimeout(() => setExpandedField(nextField.key), 600);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFieldLoading(fieldKey, false);
    }
  };

  const handleRefine = () => {
    resetField(fieldKey);
  };

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      isOpen 
        ? 'border-[var(--color-accent)] shadow-md ring-1 ring-[var(--color-accent)]/20' 
        : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
    }`}>
      {/* Accordion Header */}
      <button 
        onClick={handleExpand}
        className="w-full px-6 py-4 flex items-center justify-between bg-[var(--color-bg)] hover:bg-[var(--color-bg-secondary)] transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
            isDone 
              ? 'bg-green-100 text-green-600 border-green-200' 
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border-[var(--color-border)]'
          }`}>
            {isDone ? <Check className="w-4 h-4" /> : fieldMeta.category[0]}
          </div>
          <div>
            <span className="text-xs font-medium text-[var(--color-text-muted)]">{fieldMeta.category}</span>
            <h3 className={`text-base font-bold ${isOpen ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}>
              {fieldMeta.label}
            </h3>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-6 pb-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Guide & Input */}
            <div className="space-y-4">
              {/* Guide */}
              <div className="bg-[var(--color-accent)]/5 p-4 rounded-xl border border-[var(--color-accent)]/20">
                <h4 className="flex items-center gap-2 text-sm font-bold text-[var(--color-accent)] mb-3">
                  <Lightbulb className="w-4 h-4" />
                  기획 가이드
                </h4>
                {guides && guides.length > 0 ? (
                  <ul className="space-y-2">
                    {guides.map((guide, i) => (
                      <li key={i} className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex items-start gap-2">
                        <span className="block mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                        {guide}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[var(--color-text-muted)]">가이드를 불러오는 중...</p>
                )}
              </div>
              
              {/* Input */}
              <div>
                <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                  나의 기획 의도
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="위 가이드를 참고하여 핵심 아이디어를 입력해주세요."
                  className="w-full h-28 p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent resize-none text-sm"
                  disabled={isLoading || isDone}
                />
                
                {!isDone ? (
                  <button
                    onClick={handleGenerate}
                    disabled={!userInput.trim() || isLoading}
                    className="mt-3 w-full py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        AI 초안 생성
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleRefine}
                    className="mt-3 w-full py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-xl font-semibold text-sm hover:bg-[var(--color-bg-tertiary)] transition-colors"
                  >
                    수정하기
                  </button>
                )}
              </div>
            </div>

            {/* Right: Result */}
            <div className="bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border)] p-5 relative min-h-[200px]">
              <h4 className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
                AI Draft Result
              </h4>
              
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] gap-3">
                  <div className="w-8 h-8 border-3 border-[var(--color-accent)]/20 border-t-[var(--color-accent)] rounded-full animate-spin" />
                  <span className="text-sm animate-pulse">전문적인 내용을 작성하고 있습니다...</span>
                </div>
              ) : fieldState?.draft ? (
                <>
                  <div className="prose prose-sm max-w-none text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap">
                    {fieldState.draft}
                  </div>
                  {isDone && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> 완료
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm">
                  왼쪽에서 내용을 입력하고 생성 버튼을 눌러주세요.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
