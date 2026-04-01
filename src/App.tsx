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
import { Loader2 } from 'lucide-react';
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
            {isLoading && (
              <div className="flex items-center gap-2 text-[#D4A853]/60 text-[12px] mb-3">
                <Loader2 size={12} className="animate-spin" />
                <span>생성 중...</span>
              </div>
            )}

            {error && (
              <div className="p-3 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[12px]">
                {error}
              </div>
            )}

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
