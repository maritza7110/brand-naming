import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  StoreBasicState,
  BrandVisionState,
  ProductState,
  PersonaState,
  RecommendBatch,
} from '../types/form';

// 초기값 (모든 필드 빈 문자열)
const initialStoreBasic: StoreBasicState = {
  category: '',
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
  updateStoreBasic: (field: keyof StoreBasicState, value: string) => void;
  updateBrandVision: (field: keyof BrandVisionState, value: string) => void;
  updateProduct: (field: keyof ProductState, value: string) => void;
  updatePersona: (field: keyof PersonaState, value: string) => void;
  resetAll: () => void;
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

      updateStoreBasic: (field, value) =>
        set((state) => ({ storeBasic: { ...state.storeBasic, [field]: value } })),

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

      addBatch: (batch) =>
        set((state) => ({ batches: [batch, ...state.batches] })),

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'brand-naming-data',
      partialize: (state) => ({ batches: state.batches }),
      merge: (persisted, current) => {
        const p = persisted as { batches?: RecommendBatch[] } | undefined;
        const restoredBatches = (p?.batches ?? []).map((b) => ({
          ...b,
          createdAt: new Date(b.createdAt),
        }));
        return { ...current, batches: restoredBatches };
      },
    },
  ),
);
