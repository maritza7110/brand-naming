import { GoogleGenAI } from '@google/genai';
import type { FormState, RecommendBatch, IndustrySelection } from '../types/form';
import { useSettingsStore } from '../store/useSettingsStore';
import { useFormStore } from '../store/useFormStore';

const FIELD_LABELS: Record<string, string> = {
  location: '위치',
  scale: '매장규모',
  mainProduct: '주력상품',
  priceRange: '가격대',
  targetCustomer: '타겟고객',
  ceoVision: 'CEO비전',
  longTermGoal: '장기목표',
  personalStory: '개인스토리',
  uniqueStrength: '특장점',
  valueProposition: '핵심가치',
  philosophy: '브랜드철학',
  slogan: '슬로건',
  coreTechnology: '핵심기술',
  coreStrategy: '핵심전략',
  brandMent: '브랜드멘트',
  customerDefinition: '고객정의',
  customerValue: '고객가치',
  customerCultureCreation: '고객문화창조',
  competitiveAdvantage: '비교우위',
  qualityLevel: '품질수준',
  priceLevel: '가격수준',
  functionalBenefit: '기능적혜택',
  experientialBenefit: '경험적혜택',
  symbolicBenefit: '상징적혜택',
  brandKeyword: '브랜드키워드',
  membershipPhilosophy: '멤버쉽철학',
};

/** 업종 선택 경로를 AI 프롬프트용 문자열로 포맷 (D-08) */
function formatIndustryPath(ind: IndustrySelection): string {
  const parts = [ind.major, ind.medium, ind.minor].filter(Boolean);
  if (parts.length === 0) return '';
  let result = parts.join(' > ');
  if (ind.note) result += ` (비고: ${ind.note})`;
  return result;
}

/** 입력된 필드만 모아서 프롬프트 텍스트로 변환 */
function buildInputSummary(form: FormState): { text: string; filledFields: string[] } {
  const filledFields: string[] = [];
  const lines: string[] = [];

  // 매장 기본 -- industry 별도 처리 (D-08, D-09)
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

  // 나머지 섹션은 모든 필드가 string이므로 기존 로직 유지
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

  return { text: lines.join('\n'), filledFields };
}

/** 이미 추천된 브랜드명 목록을 프롬프트에 포함 (중복 방지) */
function buildExcludeList(): string {
  const batches = useFormStore.getState().batches;
  if (batches.length === 0) return '';

  const names = batches.flatMap((b) => b.names.map((n) => n.brandName));
  if (names.length === 0) return '';

  return `\n\n[이미 추천한 이름 — 아래 이름은 절대 다시 추천하지 마세요]\n${names.join(', ')}`;
}

/** 업로드된 지침 문서를 프롬프트에 포함 */
function buildDocumentContext(): string {
  const { documents } = useSettingsStore.getState();
  if (documents.length === 0) return '';

  const parts = documents.map(
    (doc) => `### 📄 ${doc.name}\n${doc.content}`,
  );

  return `\n\n[참고 지침서 — 아래 문서의 내용을 반드시 참고하여 네이밍하세요]\n${parts.join('\n\n')}`;
}

const SYSTEM_PROMPT = `당신은 대한민국 최고의 브랜드 네이밍 전문가입니다.
소상공인의 사업 정보와 브랜드 페르소나를 분석하여 감각적이고 기억에 남는 브랜드명을 추천합니다.

[네이밍 제1지침 — 절대 원칙]
- 직관적이고 감각적(센서리)한 브랜드명을 만드세요.
- 한글 표기를 최우선 원칙으로 합니다.
- 영어·외국어 느낌의 브랜드명이라도 반드시 한글로 표기하세요. (예: "블루보틀" ○, "Blue Bottle" ✕)
- 한글로 읽었을 때 자연스럽고, 소리만으로도 브랜드 이미지가 떠오르는 이름이어야 합니다.

[네이밍 제2지침 — 신병철 마케팅 프레임워크 기반]
사람은 논리보다 감정으로, 감정보다 본능으로 판단한다. 브랜드명은 고객의 본능에 닿아야 한다.

A. 조합의 법칙: 새로운 것을 발명하지 말고, 검색→발견→핵심역량과 조합하라.
   두 가지 익숙한 개념을 섞어 새로운 의미를 만들어라.

B. 빈틈 발견: 고객이 인식하지 못한 불편을 해결하는 이름을 만들어라.
   이름 자체가 "이것이 당신에게 필요했던 것"이라는 느낌을 줘야 한다.

C. 맥락 전환: 익숙한 것을 낯설게, 낯선 것을 익숙하게 만들어라.
   - 색채감: 이름에서 색이나 분위기가 떠오르게 (예: 스타벅스의 초록, 배민의 민트)
   - 크기감/형태감: 이름의 음절이 주는 무게감과 리듬을 활용하라.
   - 개념 전환: 기존 인식을 뒤집는 이름 (예: "배달의민족" — 배달을 민족 정체성으로)

D. 상식의 반전 (모순어법): 뇌는 불일치를 보면 해결하고 싶어한다. 인지적 관여가 높아지면 선호도도 올라간다.
   - 따뜻한 카리스마, 차가운 열정, 고요한 외침 같은 모순 결합을 활용하라.
   - 브랜드명 안에 긴장감과 호기심을 담아라.

E. 헤드라인 7원칙 (브랜드명에 적용):
   1. 키워드를 소유하라 (로켓배송, 30분 배달)
   2. 은유를 활용하라 (인생은 야구다)
   3. 운율을 맞춰라 (코카콜라, 빼빼로) — 한글 음운의 리듬감을 살려라
   4. 40자 이내로 짧게 — 브랜드명은 4음절 이내가 이상적

F. 인식 기반 경쟁우위: 브랜드명 자체가 상징적 주장을 담아야 한다.
   샤넬=여성해방, 나이키=승리처럼, 이름만으로 브랜드가 무엇을 상징하는지 알 수 있어야 한다.

규칙:
1. 반드시 정확히 2개의 브랜드명을 추천하세요.
2. 발음하기 쉽고, 업종 특성이 느껴지는 이름이어야 합니다.
3. 이미 존재하는 유명 브랜드명은 피하세요.
4. 추천 이유는 한 문장으로 간결하게 작성하세요.
5. 참고 지침서가 있으면 반드시 그 내용에 의거하여 네이밍하세요.
6. 2개 추천 간에 같은 글자나 음절을 반복 사용하지 마세요. 다양한 어감의 이름을 제시하세요.
7. 이 지침에 등장하는 단어(조합, 빈틈, 맥락, 전환 등)를 브랜드명에 직접 넣지 마세요.
8. 반드시 유효한 JSON 배열만 출력하세요. 다른 텍스트는 포함하지 마세요.`;

const USER_PROMPT = `아래 사업 정보를 바탕으로 브랜드명을 추천해주세요.

[입력된 정보]
{INPUT}{DOCS}{EXCLUDE}

다음 JSON 형식으로 정확히 2개를 추천하세요:
[
  {{
    "brandName": "추천 브랜드명",
    "reasoning": "이 이름을 추천하는 이유 (한 문장)"
  }}
]`;

interface GeminiNameResult {
  brandName: string;
  reasoning: string;
}

export async function generateBrandNames(form: FormState): Promise<RecommendBatch> {
  // 설정 스토어에서 API 키 우선, 없으면 .env 폴백
  const settingsKey = useSettingsStore.getState().apiKey;
  const apiKey = settingsKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('설정에서 Gemini API 키를 입력해주세요.');
  }

  const { text: inputSummary, filledFields } = buildInputSummary(form);
  if (filledFields.length === 0) {
    throw new Error('최소 1개 이상의 항목을 입력해주세요.');
  }

  const docContext = buildDocumentContext();
  const excludeContext = buildExcludeList();
  const ai = new GoogleGenAI({ apiKey });
  const prompt = USER_PROMPT
    .replace('{INPUT}', inputSummary)
    .replace('{DOCS}', docContext)
    .replace('{EXCLUDE}', excludeContext);

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: [
      { role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n' + prompt }] },
    ],
  });

  const raw = response.text ?? '';
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
  }

  const parsed: GeminiNameResult[] = JSON.parse(jsonMatch[0]);
  const now = new Date();

  // 배치 생성 시 현재 업종 스냅샷 캡처
  const industry = form.storeBasic.industry;
  const hasIndustry = industry.major || industry.medium || industry.minor;

  return {
    id: `batch-${now.getTime()}`,
    names: parsed.slice(0, 2).map((item) => ({
      brandName: item.brandName,
      reasoning: item.reasoning,
    })),
    basedOn: filledFields,
    createdAt: now,
    industry: hasIndustry ? { ...industry } : undefined,
  };
}
