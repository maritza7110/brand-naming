/** 업종 선택 상태 (대분류 > 중분류 > 소분류 + 비고) */
export interface IndustrySelection {
  major: string;    // 대분류 (예: "음식")
  medium: string;   // 중분류 (예: "한식")
  minor: string;    // 소분류 (예: "분식")
  note: string;     // 비고 (예: "떡볶이 전문")
}

/** 섹션 1: 매장 기본/환경 (INPUT-01 ~ INPUT-06) */
export interface StoreBasicState {
  industry: IndustrySelection; // 업종 (계층형 선택) -- 기존 category: string 대체
  location: string;            // INPUT-02 위치/지역 (text)
  scale: string;               // INPUT-03 매장 규모 (dropdown)
  mainProduct: string;         // INPUT-04 주력 상품/서비스 (textarea)
  priceRange: string;          // INPUT-05 가격대 (dropdown)
  targetCustomer: string;      // INPUT-06 타겟 고객 (textarea)
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

/** 탭 ID 타입 (4단계 위저드) */
export type TabId = 'analysis' | 'identity' | 'persona' | 'expression';

/** 분석 탭 — 신규 필드 */
export interface AnalysisState {
  competitors: string;  // 경쟁사 분석 텍스트
  usp: string;          // USP/차별화 요소 텍스트
}

/** 정체성 탭 — 신규 필드 */
export interface IdentityState {
  marketTrend: string;          // 시장 트렌드 텍스트
  brandPersonality: string[];   // 브랜드 퍼스널리티 칩 선택 (최대 3개)
}

/** 표현 탭 — 신규 필드 (고급 옵션) */
export interface ExpressionState {
  namingStyle: string[];        // 네이밍 스타일 칩 선택 (최대 2개)
  languageConstraint: string;   // 언어 제약 텍스트
}

/** 키워드별 가중치 (1~5) */
export type KeywordWeights = Record<string, number>;

/** 상표 위험도 판정 (doc_f 기반) */
export interface TrademarkRisk {
  riskLevel: '낮음' | '보통' | '높음';  // 위험도
  identityGrade: string;                  // 식별력 등급 (예: "조어상표", "암시상표")
  note: string;                           // 판정 근거 한 줄
}

/** 논리적 타당성 데이터 */
export interface RationaleData {
  validityScore: number;        // 0~100 (%)
  namingTechnique: string;      // "합성어", "은유/상징" 등
  meaningAnalysis: string;      // 의미 분석 설명
  reflectedInputs: string[];    // 반영된 입력 항목명
  documentReference?: string;   // 어느 문서·원칙 적용 (문서 기반 모드)
  trademarkRisk?: TrademarkRisk; // 상표 위험도 (문서 기반 모드)
}

/** 전체 폼 상태 */
export interface FormState {
  storeBasic: StoreBasicState;
  brandVision: BrandVisionState;
  product: ProductState;
  persona: PersonaState;
  analysis: AnalysisState;
  identity: IdentityState;
  expression: ExpressionState;
}

/** 추천 배치 — 한 번의 "추천 받기"로 생성된 결과 묶음 */
export interface RecommendBatch {
  id: string;
  names: { brandName: string; reasoning: string; rationale?: RationaleData }[];
  basedOn: string[];              // 작명 근거 (입력된 항목명)
  createdAt: Date;
  industry?: IndustrySelection;   // 배치 생성 시점의 업종 스냅샷
  consumerChecklist?: string[];   // 소비자 테스트 항목 (doc_e, 문서 기반 모드)
  processNote?: string;           // 적용된 원칙 요약 (문서 기반 모드)
}

/** 전체 앱 상태 */
export interface AppState extends FormState {
  batches: RecommendBatch[];
  isLoading: boolean;
  error: string | null;
  resetTimestamp: Date | null;  // 네이밍 초기화 시점 (RESET-01)
  activeTab: TabId;
  keywordWeights: KeywordWeights;
}
