import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from '../useFormStore';
import type { FormState, RecommendBatch } from '../../types/form';

// 테스트용 최소 FormState
const mockFormState: FormState = {
  storeBasic: {
    industry: { major: '음식', medium: '카페', minor: '', note: '' },
    location: '서울 강남',
    scale: '소형',
    mainProduct: '커피',
    priceRange: '중가',
    targetCustomer: '2030 직장인',
  },
  brandVision: { ceoVision: '최고의 카페', longTermGoal: '프랜차이즈', personalStory: '' },
  product: { uniqueStrength: '원두 직수입', valueProposition: '합리적 가격' },
  persona: {
    philosophy: '', slogan: '', coreTechnology: '', coreStrategy: '',
    brandMent: '', customerDefinition: '', customerValue: '',
    customerCultureCreation: '', competitiveAdvantage: '', qualityLevel: '',
    priceLevel: '', functionalBenefit: '', experientialBenefit: '',
    symbolicBenefit: '', brandKeyword: '', membershipPhilosophy: '',
  },
  analysis: { competitors: '', usp: '' },
  identity: { marketTrend: '', brandPersonality: [] },
  expression: { namingStyle: [], languageConstraint: '' },
};

const mockBatch: RecommendBatch = {
  id: 'batch-1',
  names: [{ brandName: '카페온', reasoning: '따뜻한 느낌' }],
  basedOn: ['업종', '위치'],
  createdAt: new Date('2026-04-08'),
};

describe('useFormStore - 세션 관리', () => {
  beforeEach(() => {
    // 각 테스트 전에 store를 초기 상태로 리셋 (Pitfall 3 방지)
    useFormStore.setState({
      currentSessionId: null,
      batches: [],
      storeBasic: {
        industry: { major: '', medium: '', minor: '', note: '' },
        location: '', scale: '', mainProduct: '', priceRange: '', targetCustomer: '',
      },
      brandVision: { ceoVision: '', longTermGoal: '', personalStory: '' },
      product: { uniqueStrength: '', valueProposition: '' },
    });
  });

  it('setCurrentSessionId로 세션 ID를 저장한다', () => {
    useFormStore.getState().setCurrentSessionId('session-123');
    expect(useFormStore.getState().currentSessionId).toBe('session-123');
  });

  it('setCurrentSessionId(null)로 리셋하면 null이 된다', () => {
    useFormStore.getState().setCurrentSessionId('old-session');
    useFormStore.getState().setCurrentSessionId(null);
    expect(useFormStore.getState().currentSessionId).toBeNull();
  });

  it('restoreSession이 폼 상태를 복원한다', () => {
    useFormStore.getState().restoreSession(mockFormState, [mockBatch]);
    const state = useFormStore.getState();
    expect(state.storeBasic.location).toBe('서울 강남');
    expect(state.storeBasic.mainProduct).toBe('커피');
    expect(state.brandVision.ceoVision).toBe('최고의 카페');
    expect(state.product.uniqueStrength).toBe('원두 직수입');
  });

  it('restoreSession이 batches를 복원한다', () => {
    useFormStore.getState().restoreSession(mockFormState, [mockBatch]);
    const state = useFormStore.getState();
    expect(state.batches).toHaveLength(1);
    expect(state.batches[0].names[0].brandName).toBe('카페온');
  });

  it('resetNaming이 currentSessionId를 null로 리셋한다 (D-03)', () => {
    useFormStore.getState().setCurrentSessionId('active-session');
    useFormStore.getState().resetNaming();
    expect(useFormStore.getState().currentSessionId).toBeNull();
  });

  it('resetNaming 후 resetTimestamp가 설정된다', () => {
    useFormStore.getState().resetNaming();
    expect(useFormStore.getState().resetTimestamp).toBeInstanceOf(Date);
  });
});
