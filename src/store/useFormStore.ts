import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  FormState,
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
  // 세션 저장/복원
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  restoreSession: (formState: FormState, batches: RecommendBatch[]) => void;
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
      currentSessionId: null as string | null,

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
          currentSessionId: null,
        }),

      addBatch: (batch) =>
        set((state) => ({ batches: [batch, ...state.batches] })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      setCurrentSessionId: (id) => set({ currentSessionId: id }),

      restoreSession: (formState, batches) =>
        set({
          storeBasic: formState.storeBasic,
          brandVision: formState.brandVision,
          product: formState.product,
          persona: formState.persona,
          analysis: formState.analysis,
          identity: formState.identity,
          expression: formState.expression,
          batches,
          resetTimestamp: null,
          activeTab: 'analysis' as TabId,
          keywordWeights: {},
        }),
    }),
    {
      name: 'brand-naming-data',
      version: 4,
      partialize: (state) => ({
        batches: state.batches,
        resetTimestamp: state.resetTimestamp,
        currentSessionId: state.currentSessionId,
      }),
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          const p = persisted as { batches?: RecommendBatch[] };
          return { ...p, resetTimestamp: null, currentSessionId: null };
        }
        if (version < 4) {
          const p = persisted as Record<string, unknown>;
          return { ...p, currentSessionId: (p as any).currentSessionId ?? null };
        }
        return persisted;
      },
      merge: (persisted, current) => {
        const p = persisted as {
          batches?: RecommendBatch[];
          resetTimestamp?: string | null;
          currentSessionId?: string | null;
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
          currentSessionId: p?.currentSessionId ?? null,
        };
      },
    },
  ),
);
