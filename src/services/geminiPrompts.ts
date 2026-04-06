/**
 * gemini.ts에서 분리된 프롬프트 빌더 함수들
 * + Layer 2: 클리셰 DB 기반 buildClicheContext (신규)
 */
import type { FormState, IndustrySelection } from '../types/form';
import { useFormStore } from '../store/useFormStore';
import { lookupCliche, formatClicheForPrompt } from '../data/clicheDb';

const FIELD_LABELS: Record<string, string> = {
  location: '위치', scale: '매장규모', mainProduct: '주력상품',
  priceRange: '가격대', targetCustomer: '타겟고객', ceoVision: 'CEO비전',
  longTermGoal: '장기목표', personalStory: '개인스토리', uniqueStrength: '특장점',
  valueProposition: '핵심가치', philosophy: '브랜드철학', slogan: '슬로건',
  coreTechnology: '핵심기술', coreStrategy: '핵심전략', brandMent: '브랜드멘트',
  customerDefinition: '고객정의', customerValue: '고객가치',
  customerCultureCreation: '고객문화창조', competitiveAdvantage: '비교우위',
  qualityLevel: '품질수준', priceLevel: '가격수준', functionalBenefit: '기능적혜택',
  experientialBenefit: '경험적혜택', symbolicBenefit: '상징적혜택',
  brandKeyword: '브랜드키워드', membershipPhilosophy: '멤버쉽철학',
  competitors: '경쟁사', usp: 'USP', marketTrend: '시장트렌드',
  brandPersonality: '브랜드퍼스널리티', namingStyle: '네이밍스타일',
  languageConstraint: '언어제약',
};

const WEIGHT_LABELS: Record<number, string> = {
  1: '참고 수준', 2: '보통', 3: '중요', 4: '매우 중요', 5: '최우선 반영',
};

function formatIndustryPath(ind: IndustrySelection): string {
  const parts = [ind.major, ind.medium, ind.minor].filter(Boolean);
  if (parts.length === 0) return '';
  let result = parts.join(' > ');
  if (ind.note) result += ` (비고: ${ind.note})`;
  return result;
}

/** 입력된 필드만 모아서 프롬프트 텍스트로 변환 */
export function buildInputSummary(form: FormState): { text: string; filledFields: string[] } {
  const filledFields: string[] = [];
  const lines: string[] = [];

  const industryPath = formatIndustryPath(form.storeBasic.industry);
  const basicEntries = Object.entries(form.storeBasic)
    .filter(([k, v]) => k !== 'industry' && typeof v === 'string' && v.trim() !== '');

  if (industryPath || basicEntries.length > 0) {
    lines.push('\n## 매장 기본/환경');
    if (industryPath) {
      lines.push(`- 업종: ${industryPath}`);
      filledFields.push('업종');
    }
    for (const [key, value] of basicEntries) {
      const label = FIELD_LABELS[key] ?? key;
      lines.push(`- ${label}: ${value as string}`);
      filledFields.push(label);
    }
  }

  const otherSections = [
    { title: '브랜드 정체성 및 비전', data: form.brandVision },
    { title: '브랜드 페르소나', data: form.persona },
  ];

  for (const section of otherSections) {
    const entries = Object.entries(section.data).filter(([, v]) => (v as string).trim() !== '');
    if (entries.length === 0) continue;
    lines.push(`\n## ${section.title}`);
    for (const [key, value] of entries) {
      const label = FIELD_LABELS[key] ?? key;
      lines.push(`- ${label}: ${value}`);
      filledFields.push(label);
    }
  }

  const analysisEntries = Object.entries(form.analysis)
    .filter(([, v]) => typeof v === 'string' && (v as string).trim() !== '');
  if (analysisEntries.length > 0) {
    lines.push('\n## 분석 (경쟁/차별화)');
    for (const [key, value] of analysisEntries) {
      const label = FIELD_LABELS[key] ?? key;
      lines.push(`- ${label}: ${value as string}`);
      filledFields.push(label);
    }
  }

  if (form.identity.marketTrend.trim()) {
    lines.push('\n## 시장 트렌드');
    lines.push(`- 시장트렌드: ${form.identity.marketTrend}`);
    filledFields.push('시장트렌드');
  }
  if (form.identity.brandPersonality.length > 0) {
    lines.push(`- 브랜드퍼스널리티: ${form.identity.brandPersonality.join(', ')}`);
    filledFields.push('브랜드퍼스널리티');
  }

  const expressionParts: string[] = [];
  if (form.expression.namingStyle.length > 0) {
    expressionParts.push(`네이밍스타일: ${form.expression.namingStyle.join(', ')}`);
    filledFields.push('네이밍스타일');
  }
  if (form.expression.languageConstraint.trim()) {
    expressionParts.push(`언어제약: ${form.expression.languageConstraint}`);
    filledFields.push('언어제약');
  }
  if (expressionParts.length > 0) {
    lines.push('\n## 표현 (네이밍 스타일)');
    expressionParts.forEach(p => lines.push(`- ${p}`));
  }

  return { text: lines.join('\n'), filledFields };
}

/** 경쟁사/USP 차별화 지침 */
export function buildDifferentiationContext(form: FormState): string {
  const parts: string[] = [];
  if (form.analysis.competitors.trim()) {
    parts.push(`[경쟁 환경]\n${form.analysis.competitors}`);
    parts.push('위 경쟁사와 명확히 차별화되는 이름을 만드세요. 비슷한 어감/의미는 피하세요.');
  }
  if (form.analysis.usp.trim()) {
    parts.push(`[핵심 차별점 (USP)]\n${form.analysis.usp}`);
    parts.push('이 차별점이 이름에서 직관적으로 느껴져야 합니다.');
  }
  return parts.length > 0 ? '\n\n' + parts.join('\n') : '';
}

/** 키워드 가중치 → 프롬프트 자연어 변환 */
export function buildWeightedKeywords(weights: Record<string, number>): string {
  const entries = Object.entries(weights).filter(([, w]) => w !== 3);
  if (entries.length === 0) return '';
  const sorted = entries.sort(([, a], [, b]) => b - a);
  const lines = sorted.map(([keyword, weight]) =>
    `- ${keyword}: ${WEIGHT_LABELS[weight] ?? '중요'} (${weight}/5)`
  );
  return `\n\n[키워드 우선순위 — 높은 순서대로 반영하세요]\n${lines.join('\n')}`;
}

/** 이미 추천된 브랜드명 목록 (중복 방지) */
export function buildExcludeList(): string {
  const batches = useFormStore.getState().batches;
  if (batches.length === 0) return '';
  const names = batches.flatMap((b) => b.names.map((n) => n.brandName));
  if (names.length === 0) return '';
  return `\n\n[이미 추천한 이름 — 아래 이름은 절대 다시 추천하지 마세요]\n${names.join(', ')}`;
}

/**
 * Layer 2: 업종별 클리셰 금지어 자동 주입 (doc_d 코드 변환)
 * clicheDb.ts에서 해당 업종 데이터를 조회해 프롬프트에 삽입
 */
export function buildClicheContext(industry: IndustrySelection): string {
  const entry = lookupCliche(industry);
  if (!entry) return '';
  return formatClicheForPrompt(entry);
}
