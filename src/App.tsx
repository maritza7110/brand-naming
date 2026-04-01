import { AppLayout } from './components/layout/AppLayout';
import { InputPanel } from './components/layout/InputPanel';
import { RecommendPanel } from './components/layout/RecommendPanel';
import { EmptyState } from './components/recommend/EmptyState';
import { StoreBasicSection } from './components/sections/StoreBasicSection';
import { BrandVisionSection } from './components/sections/BrandVisionSection';
import { ProductSection } from './components/sections/ProductSection';
import { PersonaSection } from './components/sections/PersonaSection';

function App() {
  return (
    <AppLayout
      left={
        <InputPanel>
          <StoreBasicSection />
          <BrandVisionSection />
          <ProductSection />
          <PersonaSection />
        </InputPanel>
      }
      right={
        <RecommendPanel>
          <EmptyState />
        </RecommendPanel>
      }
    />
  );
}

export default App;
