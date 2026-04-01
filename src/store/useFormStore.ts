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

interface FormActions {
  updateStoreBasic: (field: Exclude<keyof StoreBasicState, 'industry'>, value: string) => void;
  updateIndustry: (selection: IndustrySelection) => void;
  updateBrandVision: (field: keyof BrandVisionState, value: string) => void;
  updateProduct: (field: keyof ProductState, value: string) => void;
  updatePersona: (field: keyof PersonaState, value: string) => void;
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
      batches: [],
      isLoading: false,
      error: null,
      resetTimestamp: null,

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

      resetAll: () =>
        set({
          storeBasic: { ...initialStoreBasic },
          brandVision: { ...initialBrandVision },
          product: { ...initialProduct },
          persona: { ...initialPersona },
        }),

      resetNaming: () =>
        set({
          storeBasic: { ...initialStoreBasic },
          brandVision: { ...initialBrandVision },
          product: { ...initialProduct },
          persona: { ...initialPersona },
          resetTimestamp: new Date(),
        }),

      addBatch: (batch) =>
        set((state) => ({ batches: [batch, ...state.batches] })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'brand-naming-data',
      version: 2,
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
