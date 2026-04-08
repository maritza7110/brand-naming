import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { InputPanel } from '../components/layout/InputPanel';
import { RecommendPanel } from '../components/layout/RecommendPanel';
import { EmptyState } from '../components/recommend/EmptyState';
import { RecommendGroup } from '../components/recommend/RecommendGroup';
import { WizardTabs } from '../components/wizard/WizardTabs';
import { AnalysisTab } from '../components/wizard/AnalysisTab';
import { IdentityTab } from '../components/wizard/IdentityTab';
import { ExpressionTab } from '../components/wizard/ExpressionTab';
import { SettingsModal } from '../components/settings/SettingsModal';
import { PersonaTab } from '../components/wizard/PersonaTab';
import { useFormStore } from '../store/useFormStore';
import { useAuthStore } from '../store/useAuthStore';
import { sessionService } from '../services/sessionService';
import { groupBatches, splitByReset } from '../utils/groupBatches';
import { Loader2 } from 'lucide-react';
import type { FormState, RecommendBatch } from '../types/form';

export default function NamingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const batches = useFormStore((s) => s.batches);
  const isLoading = useFormStore((s) => s.isLoading);
  const error = useFormStore((s) => s.error);
  const resetTimestamp = useFormStore((s) => s.resetTimestamp);
  const currentIndustry = useFormStore((s) => s.storeBasic.industry);
  const resetNaming = useFormStore((s) => s.resetNaming);
  const activeTab = useFormStore((s) => s.activeTab);
  const setActiveTab = useFormStore((s) => s.setActiveTab);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // 세션 복원 (URL ?session=uuid)
  const sessionId = searchParams.get('session');
  const restoredRef = useRef(false);

  useEffect(() => {
    if (!sessionId || restoredRef.current) return;
    restoredRef.current = true;

    sessionService.getSessionWithResults(sessionId).then((data) => {
      const stored = data.input_data?._formState as FormState | undefined;
      if (!stored) return;

      // _batches가 있으면 원본 배치 사용 (rationale 포함), 없으면 DB에서 재구성
      const savedBatches = data.input_data?._batches as RecommendBatch[] | undefined;
      const restoredBatches: RecommendBatch[] = savedBatches
        ? savedBatches.map((b: any) => ({ ...b, createdAt: new Date(b.createdAt) }))
        : [{
            id: `restored-${data.id}`,
            names: data.naming_results.map((r: any) => ({
              brandName: r.brand_name,
              reasoning: r.reasoning ?? '',
              rationale: {
                validityScore: r.score ?? 0,
                namingTechnique: r.style_tag ?? '',
                meaningAnalysis: r.reasoning ?? '',
                reflectedInputs: Array.isArray(r.based_on) ? r.based_on : [],
              },
            })),
            basedOn: data.naming_results[0]?.based_on ?? [],
            createdAt: new Date(data.created_at),
          }];

      useFormStore.getState().restoreSession(stored, restoredBatches);
      useFormStore.getState().setCurrentSessionId(sessionId);
    }).catch(console.error);
  }, [sessionId]);

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

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AppLayout
        left={
          <InputPanel
            onSettingsClick={() => setSettingsOpen(true)}
            onResetClick={handleResetNaming}
            onAuthClick={handleAuthClick}
            authLabel={user ? '내 프로젝트' : '로그인'}
            isLoggedIn={!!user}
            tabBar={<WizardTabs activeTab={activeTab} onTabChange={setActiveTab} />}
          >
            {activeTab === 'analysis' && (
              <div className="animate-fadeIn">
                <AnalysisTab />
              </div>
            )}
            {activeTab === 'identity' && (
              <div className="animate-fadeIn">
                <IdentityTab />
              </div>
            )}
            {activeTab === 'persona' && (
              <div className="animate-fadeIn">
                <PersonaTab />
              </div>
            )}
            {activeTab === 'expression' && (
              <div className="animate-fadeIn">
                <ExpressionTab />
              </div>
            )}
          </InputPanel>
        }
        right={
          <div ref={recommendPanelRef} className="scroll-mt-4">
          <RecommendPanel>
            {isLoading && (
              <div className="flex items-center gap-2 text-[#B48C50] text-[14px] mb-3">
                <Loader2 size={14} className="animate-spin" /><span>생성 중...</span>
              </div>
            )}
            {error && (
              <div className="p-3 mb-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[13px]">
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
