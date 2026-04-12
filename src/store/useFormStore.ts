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
import type { BuilderState, PersonaFieldKey } from '../types/workshop';
import { PERSONA_FIELD_METADATA } from '../types/workshop';

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

/** BuilderState 초기화 헬퍼 */
function createInitialBuilderState(): BuilderState {
  const initial: BuilderState = {} as BuilderState;
  PERSONA_FIELD_METADATA.forEach(field => {
    initial[field.key] = {
      draft: '',
      userInput: '',
      history: [],
      isFinalized: false,
      isLoading: false,
    };
  });
  return initial;
}

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

  // Workshop 관련
  workshopMode: boolean;
  builderState: BuilderState;
  expandedField: PersonaFieldKey | null;
  guides: Partial<Record<PersonaFieldKey, string[]>>;
  toggleWorkshopMode: () => void;
  setExpandedField: (field: PersonaFieldKey | null) => void;
  setFieldGuide: (field: PersonaFieldKey, guides: string[]) => void;
  setFieldUserInput: (field: PersonaFieldKey, input: string) => void;
  setFieldDraft: (field: PersonaFieldKey, draft: string) => void;
  setFieldLoading: (field: PersonaFieldKey, loading: boolean) => void;
  finalizeField: (field: PersonaFieldKey) => void;
  resetField: (field: PersonaFieldKey) => void;
  resetWorkshop: () => void;
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

      // Workshop 초기값
      workshopMode: false,
      builderState: createInitialBuilderState(),
      expandedField: null,
      guides: {},

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
          workshopMode: false,
          builderState: createInitialBuilderState(),
          expandedField: null,
          guides: {},
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
          workshopMode: false,
          builderState: createInitialBuilderState(),
          expandedField: null,
          guides: {},
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

      // Workshop actions
      toggleWorkshopMode: () =>
        set((state) => ({ workshopMode: !state.workshopMode })),

      setExpandedField: (field) => set({ expandedField: field }),

      setFieldGuide: (field, guides) =>
        set((state) => ({ guides: { ...state.guides, [field]: guides } })),

      setFieldUserInput: (field, input) =>
        set((state) => ({
          builderState: {
            ...state.builderState,
            [field]: { ...state.builderState[field], userInput: input },
          },
        })),

      setFieldDraft: (field, draft) =>
        set((state) => ({
          builderState: {
            ...state.builderState,
            [field]: {
              ...state.builderState[field],
              draft,
              history: [...state.builderState[field].history, draft],
            },
          },
        })),

      setFieldLoading: (field, loading) =>
        set((state) => ({
          builderState: {
            ...state.builderState,
            [field]: { ...state.builderState[field], isLoading: loading },
          },
        })),

      finalizeField: (field) =>
        set((state) => ({
          builderState: {
            ...state.builderState,
            [field]: { ...state.builderState[field], isFinalized: true },
          },
        })),

      resetField: (field) =>
        set((state) => ({
          builderState: {
            ...state.builderState,
            [field]: {
              draft: '',
              userInput: '',
              history: [],
              isFinalized: false,
              isLoading: false,
            },
          },
        })),

      resetWorkshop: () =>
        set({
          workshopMode: false,
          builderState: createInitialBuilderState(),
          expandedField: null,
          guides: {},
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
