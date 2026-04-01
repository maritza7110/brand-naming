/** 섹션 1: 매장 기본/환경 (INPUT-01 ~ INPUT-06) */
export interface StoreBasicState {
  category: string;        // INPUT-01 업종/카테고리 (dropdown)
  location: string;        // INPUT-02 위치/지역 (text)
  scale: string;           // INPUT-03 매장 규모 (dropdown)
  mainProduct: string;     // INPUT-04 주력 상품/서비스 (textarea)
  priceRange: string;      // INPUT-05 가격대 (dropdown)
  targetCustomer: string;  // INPUT-06 타겟 고객 (textarea)
}

/** 섹션 2: 브랜드 정체성 및 비전 (OWNER-01 ~ OWNER-03) */
export interface BrandVisionState {
  ceoVision: string;       // OWNER-01 CEO 비전/꿈
  longTermGoal: string;    // OWNER-02 5년/10년 목표
  personalStory: string;   // OWNER-03 개인 스토리/동기
}

/** 섹션 3: 제품/서비스 핵심 (PERSONA-04 일부) */
export interface ProductState {
  uniqueStrength: string;      // 제품/서비스 특장점
  valueProposition: string;    // 고객에게 주는 핵심 가치
}

/** 섹션 5: 브랜드 페르소나 (PERSONA-01 ~ PERSONA-04) */
export interface PersonaState {
  philosophy: string;      // PERSONA-01 브랜드 철학
  slogan: string;          // PERSONA-02 슬로건
  mission: string;         // PERSONA-03 미션
  brandStory: string;      // PERSONA-04 브랜드 스토리
  coreValues: string;      // PERSONA-04 핵심 가치
  differentiation: string; // PERSONA-04 차별화 포인트
  toneAndManner: string;   // PERSONA-04 브랜드 톤앤매너
}

/** 전체 폼 상태 */
export interface FormState {
  storeBasic: StoreBasicState;
  brandVision: BrandVisionState;
  product: ProductState;
  persona: PersonaState;
}

/** 추천 카드 (Phase 2 대비) */
export interface RecommendCard {
  id: string;
  brandName: string;
  reasoning: string;
  basedOn: string[];
  createdAt: Date;
}

/** 전체 앱 상태 */
export interface AppState extends FormState {
  recommendations: RecommendCard[];
}
