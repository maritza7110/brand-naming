/**
 * Workshop Builder Types
 * 심층 기획 워크숍 모드에서 사용하는 타입들
 */
import type { PersonaState } from './form';

/** 페르소나 필드 키 (PersonaState에서 brandKeyword 제외) */
export type PersonaFieldKey = Exclude<keyof PersonaState, 'brandKeyword'>;

export interface FieldGuide {
  key: PersonaFieldKey;
  guides: string[]; // 3 specific guiding questions per field
}

export interface FieldState {
  draft: string;          // AI generated content
  userInput: string;       // User's answer to the guides
  history: string[];      // Previous drafts
  isFinalized: boolean;
  isLoading: boolean;
}

export type BuilderState = Record<PersonaFieldKey, FieldState>;

/** Field metadata - UI 표시용 라벨과 카테고리 */
export const PERSONA_FIELD_METADATA: { key: PersonaFieldKey; label: string; category: string }[] = [
  { key: 'philosophy', label: '브랜드 철학', category: '정체성' },
  { key: 'slogan', label: '슬로건', category: '정체성' },
  { key: 'brandMent', label: '브랜드 멘트', category: '정체성' },
  { key: 'coreTechnology', label: '핵심 기술/역량', category: '전략' },
  { key: 'coreStrategy', label: '핵심 전략', category: '전략' },
  { key: 'competitiveAdvantage', label: '비교 우위 속성', category: '전략' },
  { key: 'customerDefinition', label: '고객 정의', category: '시장' },
  { key: 'customerValue', label: '고객 가치', category: '시장' },
  { key: 'customerCultureCreation', label: '고객 문화 창조', category: '시장' },
  { key: 'qualityLevel', label: '품질 수준', category: '가치' },
  { key: 'priceLevel', label: '가격 수준', category: '가치' },
  { key: 'functionalBenefit', label: '기능적 혜택', category: '가치' },
  { key: 'experientialBenefit', label: '경험적 혜택', category: '가치' },
  { key: 'symbolicBenefit', label: '상징적 혜택', category: '가치' },
  { key: 'membershipPhilosophy', label: '고객 관리 철학', category: '경험' },
];
