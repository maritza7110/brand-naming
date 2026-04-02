import { useState, useEffect, useRef, useMemo } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { InputPanel } from './components/layout/InputPanel';
import { RecommendPanel } from './components/layout/RecommendPanel';
import { EmptyState } from './components/recommend/EmptyState';
import { RecommendGroup } from './components/recommend/RecommendGroup';
import { StoreBasicSection } from './components/sections/StoreBasicSection';
import { BrandVisionSection } from './components/sections/BrandVisionSection';
import { PersonaSection } from './components/sections/PersonaSection';
import { SettingsModal } from './components/settings/SettingsModal';
import { useFormStore } from './store/useFormStore';
import { groupBatches, splitByReset } from './utils/groupBatches';
import { Loader2 } from 'lucide-react';

function App() {
  const batches = useFormStore((s) => s.batches);
  const isLoading = useFormStore((s) => s.isLoading);
  const error = useFormStore((s) => s.error);
  const resetTimestamp = useFormStore((s) => s.resetTimestamp);
  const currentIndustry = useFormStore((s) => s.storeBasic.industry);
  const resetNaming = useFormStore((s) => s.resetNaming);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // 그룹 토글 핸들러
  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // 모바일 자동 스크롤 ref (D-02)
  const recommendPanelRef = useRef<HTMLDivElement>(null);
  const prevBatchCountRef = useRef(batches.length);

  // 업종 변경 자동 접힘 (GROUP-03)
  const prevMinorRef = useRef(currentIndustry.minor);

  useEffect(() => {
    const prevMinor = prevMinorRef.current;
    const currentMinor = currentIndustry.minor;
    prevMinorRef.current = currentMinor;

    // 이전 업종이 있고, 현재 업종과 다르면 이전 그룹 접기
    if (prevMinor && prevMinor !== currentMinor) {
      setCollapsedGroups((prev) => new Set([...prev, prevMinor]));
    }
  }, [currentIndustry.minor]);

  // 모바일 자동 스크롤 -- 추천 완료 시 추천 패널로 이동 (D-02)
  useEffect(() => {
    const prevCount = prevBatchCountRef.current;
    prevBatchCountRef.current = batches.length;

    // 새 배치가 추가되었을 때 (로딩 완료 후)
    if (!isLoading && batches.length > prevCount && prevCount > 0) {
      if (window.innerWidth < 1024 && recommendPanelRef.current) {
        setTimeout(() => {
          recommendPanelRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    }
  }, [isLoading, batches.length]);

  // resetTimestamp 기반 current/archived 분리
  const { current: currentBatches, archived: archivedBatches } = useMemo(
    () => splitByReset(batches, resetTimestamp),
    [batches, resetTimestamp],
  );

  const currentGroups = useMemo(
    () => groupBatches(currentBatches),
    [currentBatches],
  );

  const archivedGroups = useMemo(
    () => groupBatches(archivedBatches),
    [archivedBatches],
  );

  // 네이밍 초기화 핸들러 — 기존 그룹을 모두 접기
  const handleResetNaming = () => {
    const keysToCollapse = currentGroups.map((g) => `archived-${g.key}`);
    resetNaming();
    setCollapsedGroups((prev) => new Set([...prev, ...keysToCollapse]));
  };

  return (
    <>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AppLayout
        left={
          <InputPanel
            onSettingsClick={() => setSettingsOpen(true)}
            onResetClick={handleResetNaming}
          >
            <StoreBasicSection />
            <BrandVisionSection />
            <PersonaSection />
          </InputPanel>
        }
        right={
          <div ref={recommendPanelRef} className="scroll-mt-4">
          <RecommendPanel>
            {isLoading && (
              <div className="flex items-center gap-2 text-[#B48C50] text-[12px] mb-3">
                <Loader2 size={12} className="animate-spin" /><span>생성 중...</span>
              </div>
            )}
            {error && (
              <div className="p-3 mb-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[12px]">
                {error}
              </div>
            )}
            {currentGroups.length === 0 && archivedGroups.length === 0 && !isLoading ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {currentGroups.map((group) => (
                  <RecommendGroup
                    key={group.key}
                    label={group.label}
                    batches={group.batches}
                    isOpen={!collapsedGroups.has(group.key)}
                    onToggle={() => toggleGroup(group.key)}
                    count={group.batches.length}
                  />
                ))}

                {/* 아카이브 — 초기화 이전 배치도 업종별 그룹 */}
                {archivedGroups.map((group) => (
                  <RecommendGroup
                    key={`archived-${group.key}`}
                    label={group.label}
                    batches={group.batches}
                    isOpen={!collapsedGroups.has(`archived-${group.key}`)}
                    onToggle={() => toggleGroup(`archived-${group.key}`)}
                    count={group.batches.length}
                  />
                ))}
              </div>
            )}
          </RecommendPanel>
          </div>
        }
      />
    </>
  );
}

export default App;
