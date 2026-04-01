import { AppLayout } from './components/layout/AppLayout';
import { InputPanel } from './components/layout/InputPanel';
import { RecommendPanel } from './components/layout/RecommendPanel';
import { EmptyState } from './components/recommend/EmptyState';
import { RecommendCardItem } from './components/recommend/RecommendCardItem';
import { StoreBasicSection } from './components/sections/StoreBasicSection';
import { BrandVisionSection } from './components/sections/BrandVisionSection';
import { PersonaSection } from './components/sections/PersonaSection';
import { SettingsModal } from './components/settings/SettingsModal';
import { useFormStore } from './store/useFormStore';
import { Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

function App() {
  const batches = useFormStore((s) => s.batches);
  const isLoading = useFormStore((s) => s.isLoading);
  const error = useFormStore((s) => s.error);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
    <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    <AppLayout
      left={
        <InputPanel onSettingsClick={() => setSettingsOpen(true)}>
          <StoreBasicSection />
          <BrandVisionSection />
          <PersonaSection />
        </InputPanel>
      }
      right={
        <RecommendPanel>
          {/* 로딩 표시 */}
          {isLoading && (
            <div className="flex items-center gap-2 text-blue-600 text-[14px] mb-4">
              <Loader2 size={16} className="animate-spin" />
              <span>AI가 브랜드명을 생성 중입니다...</span>
            </div>
          )}

          {/* 에러 표시 */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-red-50 text-red-700 text-[13px]">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 추천 결과 또는 빈 상태 */}
          {batches.length === 0 && !isLoading ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {batches.map((batch) => (
                <RecommendCardItem key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </RecommendPanel>
      }
    />
    </>
  );
}

export default App;
