import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  StoreBasicState,
  BrandVisionState,
  ProductState,
  PersonaState,
  RecommendBatch,
  IndustrySelection,
  AnalysisState,
  IdentityState,
  ExpressionState,
  TabId,
  KeywordWeights,
} from '../types/form';

// 초기값 (모든 필드 빈 문자열)
const initialStoreBasic: StoreBasicState = {
  industry: { major: '', medium: '', minor: '', note: '' },
  location: '',
  scale: '',
  mainProduct: '',
  priceRange: '',
  targetCustomer: '',
};

const initialBrandVision: BrandVisionState = {
  ceoVision: '',
  longTermGoal: '',
  personalStory: '',
};

const initialProduct: ProductState = {
  uniqueStrength: '',
  valueProposition: '',
};

const initialPersona: PersonaState = {
  philosophy: '',
  slogan: '',
  coreTechnology: '',
  coreStrategy: '',
  brandMent: '',
  customerDefinition: '',
  customerValue: '',
  customerCultureCreation: '',
  competitiveAdvantage: '',
  qualityLevel: '',
  priceLevel: '',
  functionalBenefit: '',
  experientialBenefit: '',
  symbolicBenefit: '',
  brandKeyword: '',
  membershipPhilosophy: '',
};

const initialAnalysis: AnalysisState = {
  competitors: '',
  usp: '',
};

const initialIdentity: IdentityState = {
  marketTrend: '',
  brandPersonality: [],
};

const initialExpression: ExpressionState = {
  namingStyle: [],
  languageConstraint: '',
};

interface FormActions {
  updateStoreBasic: (field: Exclude<keyof StoreBasicState, 'industry'>, value: string) => void;
  updateIndustry: (selection: IndustrySelection) => void;
  updateBrandVision: (field: keyof BrandVisionState, value: string) => void;
  updateProduct: (field: keyof ProductState, value: string) => void;
  updatePersona: (field: keyof PersonaState, value: string) => void;
  updateAnalysis: (field: keyof AnalysisState, value: string) => void;
  updateIdentityText: (field: 'marketTrend', value: string) => void;
  updateIdentityChips: (field: 'brandPersonality', value: string[]) => void;
  updateExpressionChips: (field: 'namingStyle', value: string[]) => void;
  updateExpressionText: (field: 'languageConstraint', value: string) => void;
  setActiveTab: (tab: TabId) => void;
  setKeywordWeight: (keyword: string, weight: number) => void;
  resetKeywordWeights: () => void;
  resetAll: () => void;
  resetNaming: () => void;  // 폼 초기화 + resetTimestamp 기록
  addBatch: (batch: RecommendBatch) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFormStore = create<AppState & FormActions>()(
  persist(
    (set) => ({
      storeBasic: { ...initialStoreBasic },
      brandVision: { ...initialBrandVision },
      product: { ...initialProduct },
      persona: { ...initialPersona },
      analysis: { ...initialAnalysis },
      identity: { ...initialIdentity },
      expression: { ...initialExpression },
      batches: [],
      isLoading: false,
      error: null,
      resetTimestamp: null,
      activeTab: 'analysis' as TabId,
      keywordWeights: {} as KeywordWeights,

      updateStoreBasic: (field, value) =>
        set((state) => ({ storeBasic: { ...state.storeBasic, [field]: value } })),

      updateIndustry: (selection) =>
        set((state) => ({
          storeBasic: { ...state.storeBasic, industry: selection },
        })),

      updateBrandVision: (field, value) =>
        set((state) => ({ brandVision: { ...state.brandVision, [field]: value } })),

      updateProduct: (field, value) =>
        set((state) => ({ product: { ...state.product, [field]: value } })),

      updatePersona: (field, value) =>
        set((state) => ({ persona: { ...state.persona, [field]: value } })),

      updateAnalysis: (field, value) =>
        set((state) => ({ analysis: { ...state.analysis, [field]: value } })),

      updateIdentityText: (field, value) =>
        set((state) => ({ identity: { ...state.identity, [field]: value } })),

      updateIdentityChips: (field, value) =>
        set((state) => ({ identity: { ...state.identity, [field]: value } })),

      updateExpressionChips: (field, value) =>
        set((state) => ({ expression: { ...state.expression, [field]: value } })),

      updateExpressionText: (field, value) =>
        set((state) => ({ expression: { ...state.expression, [field]: value } })),

      setActiveTab: (tab) => set({ activeTab: tab }),

      setKeywordWeight: (keyword, weight) =>
        set((state) => ({ keywordWeights: { ...state.keywordWeights, [keyword]: weight } })),

      resetKeywordWeights: () => set({ keywordWeights: {} }),

      resetAll: () =>
        set({
          storeBasic: { ...initialStoreBasic },
          brandVision: { ...initialBrandVision },
          product: { ...initialProduct },
          persona: { ...initialPersona },
          analysis: { ...initialAnalysis },
          identity: { ...initialIdentity },
          expression: { ...initialExpression },
          keywordWeights: {},
          activeTab: 'analysis' as TabId,
        }),

      resetNaming: () =>
        set({
          storeBasic: { ...initialStoreBasic },
          brandVision: { ...initialBrandVision },
          product: { ...initialProduct },
          persona: { ...initialPersona },
          analysis: { ...initialAnalysis },
          identity: { ...initialIdentity },
          expression: { ...initialExpression },
          keywordWeights: {},
          activeTab: 'analysis' as TabId,
          resetTimestamp: new Date(),
        }),

      addBatch: (batch) =>
        set((state) => ({ batches: [batch, ...state.batches] })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'brand-naming-data',
      version: 3,
      partialize: (state) => ({
        batches: state.batches,
        resetTimestamp: state.resetTimestamp,
      }),
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          // v1 -> v2: resetTimestamp 추가, 기존 배치 보존 (industry=undefined)
          const p = persisted as { batches?: RecommendBatch[] };
          return { ...p, resetTimestamp: null };
        }
        if (version < 3) {
          // v2 -> v3: rationale 필드 없는 기존 배치 호환 (optional이므로 자동 호환)
          return persisted;
        }
        return persisted;
      },
      merge: (persisted, current) => {
        const p = persisted as {
          batches?: RecommendBatch[];
          resetTimestamp?: string | null;
        } | undefined;
        const restoredBatches = (p?.batches ?? []).map((b) => ({
          ...b,
          createdAt: new Date(b.createdAt),
        }));
        const restoredTimestamp = p?.resetTimestamp
          ? new Date(p.resetTimestamp)
          : null;
        return {
          ...current,
          batches: restoredBatches,
          resetTimestamp: restoredTimestamp,
        };
      },
    },
  ),
);
