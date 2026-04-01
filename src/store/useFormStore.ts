import { create } from 'zustand';
import type {
  AppState,
  StoreBasicState,
  BrandVisionState,
  ProductState,
  PersonaState,
  RecommendCard,
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
  addRecommendation: (card: RecommendCard) => void;
}

export const useFormStore = create<AppState & FormActions>((set) => ({
  storeBasic: { ...initialStoreBasic },
  brandVision: { ...initialBrandVision },
  product: { ...initialProduct },
  persona: { ...initialPersona },
  recommendations: [],

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

  addRecommendation: (card) =>
    set((state) => ({ recommendations: [card, ...state.recommendations] })),
}));
