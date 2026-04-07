import { GoogleGenAI } from '@google/genai';

export const MODEL_NAME = 'gemini-3-flash-preview';
import type { FormState, RecommendBatch } from '../types/form';
import { useSettingsStore } from '../store/useSettingsStore';
import {
  buildInputSummary,
  buildDifferentiationContext,
  buildWeightedKeywords,
  buildExcludeList,
  buildClicheContext,
} from './geminiPrompts';

// ─── 문서 없는 경우 기본 시스템 프롬프트 ────────────────────────────────────
const SYSTEM_PROMPT = `당신은 대한민국 최고의 브랜드 네이밍 전문가입니다.
소상공인의 사업 정보와 브랜드 페르소나를 분석하여 감각적이고 기억에 남는 브랜드명을 추천합니다.

[네이밍 제1지침 — 절대 원칙]
- 직관적이고 감각적(센서리)한 브랜드명을 만드세요.
- 한글 표기를 최우선 원칙으로 합니다.
- 영어·외국어 느낌의 브랜드명이라도 반드시 한글로 표기하세요.
- 한글로 읽었을 때 자연스럽고, 소리만으로도 브랜드 이미지가 떠오르는 이름이어야 합니다.

[네이밍 제2지침 — 신병철 마케팅 프레임워크 기반]
A. 조합의 법칙: 두 가지 익숙한 개념을 섞어 새로운 의미를 만들어라.
B. 빈틈 발견: 고객이 인식하지 못한 불편을 해결하는 이름을 만들어라.
C. 맥락 전환: 익숙한 것을 낯설게, 낯선 것을 익숙하게 만들어라.
D. 상식의 반전: 모순어법으로 긴장감과 호기심을 담아라.
E. 헤드라인 원칙: 키워드 소유, 은유, 운율, 4음절 이내.
F. 인식 기반: 이름 자체가 상징적 주장을 담아야 한다.

[타당성 점수 산출]
입력 연관성(40%) + 네이밍 기법(20%) + 발음/기억성(20%) + 업종 반영(20%)

규칙:
1. 반드시 정확히 2개의 브랜드명을 추천하세요.
2. 발음하기 쉽고, 업종 특성이 느껴지는 이름이어야 합니다.
3. 이미 존재하는 유명 브랜드명은 피하세요.
4. 추천 이유는 한 문장으로 간결하게 작성하세요.`;

// ─── 문서 있는 경우 Layer 1 시스템 프롬프트 ─────────────────────────────────
function buildDocumentSystemInstruction(docContents: string): string {
  return `당신은 전문 브랜드 네이밍 AI입니다.
업로드된 두 문서가 당신의 유일한 작업 기준입니다.

━━━ 지침 문서 내용 ━━━

${docContents}

━━━ 문서 역할 ━━━

[brand_naming_guidelines_detailed.pdf]
14개 바이블의 원칙과 판단 기준입니다.
이름을 생성하고 평가할 때 근거를 반드시 이 문서에서 찾으세요.
어떤 판단을 내렸을 때 어느 바이블의 어느 원칙을 적용했는지 명시하세요.

[brand_naming_protocol.pdf]
작업 절차와 실행 규칙입니다.
반드시 이 문서의 순서를 따르세요:
Layer 1 → 입력된 업종·목표·페르소나에 맞는 원칙과 가중치 결정
Layer 2 → 원칙 충돌 감지 및 해결
Layer 3 → 7단계 절차 순서대로 실행
Layer 4 → 100점 만점 채점 루브릭 적용

━━━ 작업 절차 ━━━

1. Layer 1 매핑 테이블로 적용할 원칙과 가중치를 먼저 결정하세요.
2. Layer 2로 원칙 충돌 여부를 확인하고 해결하세요.
3. 시스템이 제공하는 해당 업종 금지어·금지패턴 목록을 확인하세요.
4. 이름 후보 100개 이상을 생성하세요. 자기검열 없이 발산하세요.
5. 명백한 탈락 기준(발음 불가·금기어 포함·보통명사·업종 클리셰)으로
   1차 필터링하세요.
6. Layer 4 채점 루브릭으로 남은 후보를 채점하세요.
7. 상위 3~5개를 선정하고 각각에 대해 다음을 제공하세요:
   - 이름 내러티브 (왜 이 이름인가, 3~5문장)
   - 강점 3가지 (비전문가가 이해할 수 있는 언어로)
   - 주의사항
   - 슬로건 아이디어 1~2개
   - 상표 출원 권고 (시스템이 제공하는 상표 위험도 판정 결과 반영)

━━━ 절대 원칙 ━━━

- 이름은 직관적이고 감각적(센서리)해야 합니다 — 소리만으로도 브랜드 이미지가 떠오르는 이름.
- 문서에 없는 방법으로 이름을 만들지 않습니다.
- 각 판단마다 어느 문서의 어느 기준을 적용했는지 밝힙니다.
- documentReference는 실제로 해당 이름에 가장 직접적으로 적용된 이론을 인용합니다.
- 최종 후보는 반드시 3~5개를 추천하세요.
- 한글 표기를 최우선으로 합니다.

━━━ 인용 균형 원칙 (반드시 준수) ━━━

각 후보의 documentReference에 반드시 2~3개 원칙을 인용하세요.
인용 비율 규칙:
- 각 후보에서 최소 1개는 글로벌 원전(BOOK 01~10, PAPER 06~08)을 인용해야 합니다.
- 전체 후보(3~5개) 기준으로 글로벌 원전 인용 비율이 70% 이상이어야 합니다.
- 한국 서적(한국 01~04)은 한국어 음운·형태론·한글 조합 관련 판단에만 보조 인용합니다.
- 한국 서적만 단독 인용하는 것은 금지합니다. 반드시 글로벌 원전과 함께 인용하세요.
- 동일 저자를 연속 2개 후보에서 반복 인용하지 마세요.
- 인용 형식: "Rob Meyerson, 《Brand Naming》, SMILE 프레임워크 / Alexandra Watkins, 《Hello, My Name Is Awesome》, SCRATCH 탈락 기준"`;
}

/** 시스템 인스트럭션 — 문서 있으면 Layer 1 기반, 없으면 기본 프롬프트 */
function buildSystemInstruction(): string {
  const { documents } = useSettingsStore.getState();
  if (documents.length === 0) return SYSTEM_PROMPT;

  const docContents = documents
    .map((doc) => `=== ${doc.name} ===\n${doc.content}`)
    .join('\n\n');

  return buildDocumentSystemInstruction(docContents);
}

const USER_PROMPT = `아래 사업 정보를 바탕으로 브랜드명을 추천해주세요.

[입력된 정보]
{INPUT}{DIFFERENTIATION}{CLICHE}{WEIGHTS}{EXCLUDE}

문서가 업로드된 경우 3~5개, 없는 경우 2개를 추천하세요.`;

// ─── 문서 없는 경우 스키마 ──────────────────────────────────────────────────
const SCHEMA_SIMPLE = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      brandName:       { type: 'string', description: '추천 브랜드명 (한글)' },
      reasoning:       { type: 'string', description: '추천 이유 (한 문장)' },
      validityScore:   { type: 'number', description: '타당성 점수 (0~100)' },
      namingTechnique: { type: 'string', description: '사용된 네이밍 기법' },
      meaningAnalysis: { type: 'string', description: '의미 분석 설명' },
      reflectedInputs: { type: 'array', items: { type: 'string' }, description: '반영된 입력 항목명' },
    },
    required: ['brandName', 'reasoning', 'validityScore', 'namingTechnique', 'meaningAnalysis', 'reflectedInputs'],
  },
} as const;

// ─── 문서 있는 경우 스키마 ──────────────────────────────────────────────────
const SCHEMA_DOC_BASED = {
  type: 'object',
  properties: {
    candidates: {
      type: 'array',
      description: '최종 후보 3~5개',
      items: {
        type: 'object',
        properties: {
          brandName:          { type: 'string' },
          reasoning:          { type: 'string' },
          validityScore:      { type: 'number', description: '채점 결과 (0~100, Layer 4 기준)' },
          namingTechnique:    { type: 'string' },
          meaningAnalysis:    { type: 'string' },
          reflectedInputs:    { type: 'array', items: { type: 'string' } },
          documentReference:  { type: 'string', description: '적용된 원칙 2~3개를 나열. 형식: "Rob Meyerson, 《Brand Naming》, SMILE 프레임워크 / David Aaker, 《Managing Brand Equity》, 브랜드 자산 이론". 글로벌 원전(BOOK 01~10, PAPER 06~08) 위주로 인용하고 한국 서적은 보조적으로만 사용' },
          trademarkRiskLevel: { type: 'string', description: '낮음 / 보통 / 높음' },
          trademarkGrade:     { type: 'string', description: '조어상표 / 암시상표 / 임의상표 / 기술적상표' },
          trademarkNote:      { type: 'string', description: '상표 판정 근거 한 줄' },
        },
        required: ['brandName', 'reasoning', 'validityScore', 'namingTechnique', 'meaningAnalysis',
                   'reflectedInputs', 'documentReference', 'trademarkRiskLevel', 'trademarkGrade', 'trademarkNote'],
      },
    },
    consumerChecklist: { type: 'array', items: { type: 'string' } },
    processNote:       { type: 'string', description: '적용된 원칙·레이어 요약' },
  },
  required: ['candidates', 'consumerChecklist', 'processNote'],
} as const;

interface SimpleResult {
  brandName: string; reasoning: string; validityScore?: number;
  namingTechnique?: string; meaningAnalysis?: string; reflectedInputs?: string[];
}
interface DocBasedResult {
  candidates: {
    brandName: string; reasoning: string; validityScore: number;
    namingTechnique: string; meaningAnalysis: string; reflectedInputs: string[];
    documentReference: string; trademarkRiskLevel: string;
    trademarkGrade: string; trademarkNote: string;
  }[];
  consumerChecklist: string[];
  processNote: string;
}

export async function generateBrandNames(
  form: FormState,
  keywordWeights?: Record<string, number>
): Promise<RecommendBatch> {
  const settingsKey = useSettingsStore.getState().apiKey;
  const apiKey = settingsKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('설정에서 Gemini API 키를 입력해주세요.');
  }

  const { text: inputSummary, filledFields } = buildInputSummary(form);
  if (filledFields.length === 0) {
    throw new Error('최소 1개 이상의 항목을 입력해주세요.');
  }

  const diffContext    = buildDifferentiationContext(form);
  const clicheContext  = buildClicheContext(form.storeBasic.industry);
  const weightContext  = keywordWeights ? buildWeightedKeywords(keywordWeights) : '';
  const excludeContext = buildExcludeList();
  const hasDocuments   = useSettingsStore.getState().documents.length > 0;

  const prompt = USER_PROMPT
    .replace('{INPUT}', inputSummary)
    .replace('{DIFFERENTIATION}', diffContext)
    .replace('{CLICHE}', clicheContext)
    .replace('{WEIGHTS}', weightContext)
    .replace('{EXCLUDE}', excludeContext);

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: buildSystemInstruction(),
      responseMimeType: 'application/json',
      responseSchema: hasDocuments ? SCHEMA_DOC_BASED : SCHEMA_SIMPLE,
    },
  });

  const raw = response.text ?? '';
  const now = new Date();
  const industry = form.storeBasic.industry;
  const hasIndustry = industry.major || industry.medium || industry.minor;

  if (hasDocuments) {
    let parsed: DocBasedResult;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
      parsed = JSON.parse(m[0]);
    }
    return {
      id: `batch-${now.getTime()}`,
      names: parsed.candidates.map((c) => ({
        brandName: c.brandName,
        reasoning: c.reasoning,
        rationale: {
          validityScore:     Math.min(100, Math.max(0, c.validityScore)),
          namingTechnique:   c.namingTechnique,
          meaningAnalysis:   c.meaningAnalysis,
          reflectedInputs:   c.reflectedInputs,
          documentReference: c.documentReference,
          trademarkRisk: {
            riskLevel:     (c.trademarkRiskLevel as '낮음' | '보통' | '높음') ?? '보통',
            identityGrade: c.trademarkGrade,
            note:          c.trademarkNote,
          },
        },
      })),
      basedOn:           filledFields,
      createdAt:         now,
      industry:          hasIndustry ? { ...industry } : undefined,
      consumerChecklist: parsed.consumerChecklist,
      processNote:       parsed.processNote,
    };
  }

  let simple: SimpleResult[];
  try {
    simple = JSON.parse(raw);
  } catch {
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
    simple = JSON.parse(m[0]);
  }
  return {
    id: `batch-${now.getTime()}`,
    names: simple.slice(0, 2).map((item) => ({
      brandName: item.brandName,
      reasoning: item.reasoning,
      rationale: item.validityScore != null ? {
        validityScore:   Math.min(100, Math.max(0, item.validityScore)),
        namingTechnique: item.namingTechnique ?? '분석 중',
        meaningAnalysis: item.meaningAnalysis ?? '',
        reflectedInputs: item.reflectedInputs ?? [],
      } : undefined,
    })),
    basedOn:  filledFields,
    createdAt: now,
    industry:  hasIndustry ? { ...industry } : undefined,
  };
}
