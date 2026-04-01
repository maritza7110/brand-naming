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

/** 섹션 5: 브랜드 페르소나 — 기존 앱 16개 항목 (브랜드명 제외) */
export interface PersonaState {
  philosophy: string;              // 브랜드철학
  slogan: string;                  // 슬로건
  coreTechnology: string;          // 핵심기술
  coreStrategy: string;            // 핵심전략
  brandMent: string;               // 브랜드 멘트
  customerDefinition: string;      // 고객정의(타겟)
  customerValue: string;           // 고객가치
  customerCultureCreation: string; // 고객문화창조
  competitiveAdvantage: string;    // 브랜드 비교 우위 속성
  qualityLevel: string;            // 품질수준
  priceLevel: string;              // 가격수준
  functionalBenefit: string;       // 고통을 해결하는 기능적혜택
  experientialBenefit: string;     // 경험적혜택
  symbolicBenefit: string;         // 상징적혜택
  brandKeyword: string;            // 브랜드 키워드
  membershipPhilosophy: string;    // 고객 관리(멤버쉽) 철학
}

/** 전체 폼 상태 */
export interface FormState {
  storeBasic: StoreBasicState;
  brandVision: BrandVisionState;
  product: ProductState;
  persona: PersonaState;
}

/** 추천 배치 — 한 번의 "추천 받기"로 생성된 결과 묶음 */
export interface RecommendBatch {
  id: string;
  names: { brandName: string; reasoning: string }[];
  basedOn: string[];   // 작명 근거 (입력된 항목명)
  createdAt: Date;
}

/** 전체 앱 상태 */
export interface AppState extends FormState {
  batches: RecommendBatch[];
  isLoading: boolean;
  error: string | null;
}
