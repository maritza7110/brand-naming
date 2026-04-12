/**
 * Industry Placeholder Cache Service
 * 업종별 예시 Placeholder를 AI로 생성하고 캐싱
 */
import type { IndustrySelection } from '../types/form';
import { useSettingsStore } from '../store/useSettingsStore';
import { useFormStore } from '../../store/useFormStore';
import { MODEL_NAME } from './gemini';

interface CachedExamples {
  competitors: string;
  usp: string;
  ceoVision: string;
  longTermGoal: string;
  personalStory: string;
  uniqueStrength: string;
  valueProposition: string;
  languageConstraint: string;
  marketTrend: string;
  timestamp: number;
}

/** 메모리 캐시 (세션 내에서만 유지) */
const memoryCache: Record<string, CachedExamples> = {};

// 캐시 키 생성
function getCacheKey(industry: IndustrySelection): string {
  return [industry.major, industry.medium, industry.minor].filter(Boolean).join('|');
}

/**
 * 업종별 예시 생성 (AI 사용)
 */
async function generateExamplesViaAI(industry: IndustrySelection): Promise<CachedExamples> {
  const apiKey = useSettingsStore.getState().apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return getDefaultExamples();
  }

  const industryPath = [industry.major, industry.medium, industry.minor].filter(Boolean).join(' > ');

  const prompt = `
당신은 브랜드 네이밍 앱의助手입니다.
사용자가 선택한 업종에 맞는 현실적인 예시를 생성해주세요.

[업종]: ${industryPath}

[요청]
아래 항목들에 대해 해당 업종에서 실제로 있을 법한 구체적인 예시를 각각 1개씩 작성해주세요.
형식: "예: [구체적인 내용]"

1. CEO 비전/꿈:
2. 5년/10년 목표:
3. 개인 스토리:
4. 제품/서비스 특장점:
5. 고객에게 주는 핵심 가치:
6. 언어 제약 (네이밍 시 제약):

[주의]
- 해당 업종에 실제로 존재하는 모습으로 작성
- 추상적이지 않고 구체적인 특징 포함
- 반드시 한국어로 작성

예시 (카페일 경우):
1. CEO 비전/꿈: 예: 동네 사람들에게 가장 따뜻한 아침을 선물하는 카페
2. 5년/10년 목표: 예: 3년 내 2호점, 자체 원두 로스팅 브랜드 런칭
3. 개인 스토리: 예: 10년간 바리스타로 일하며 나만의 카페를 꿈꿨습니다
4. 제품/서비스 특장점: 예: 직접 로스팅한 싱글오리진 원두, 매일 아침 굽는 수제 빵
5. 고객에게 주는 핵심 가치: 예: 바쁜 일상 속 여유로운 한 잔의 시간
6. 언어 제약: 예: '한글 3자 이내', '발음하기 쉬운'
`;

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = response.text?.trim() || '';

    // 각 줄 파싱
    const lines = text.split('\n').filter(l => l.trim());
    const result: CachedExamples = {
      competitors: getDefaultExamples().competitors,
      usp: getDefaultExamples().usp,
      ceoVision: '',
      longTermGoal: '',
      personalStory: '',
      uniqueStrength: '',
      valueProposition: '',
      languageConstraint: '',
      timestamp: Date.now(),
    };

    for (const line of lines) {
      const numMatch = line.match(/^(\d+)\.\s*/);
      if (!numMatch) continue;
      const idx = parseInt(numMatch[1]);
      const content = line.replace(/^\d+\.\s*/, '').replace(/^예:\s*/, '').trim();

      switch (idx) {
        case 1: result.ceoVision = content; break;
        case 2: result.longTermGoal = content; break;
        case 3: result.personalStory = content; break;
        case 4: result.uniqueStrength = content; break;
        case 5: result.valueProposition = content; break;
        case 6: result.languageConstraint = content; break;
      }
    }

    // 파싱 실패 시 competitors/usp fallback
    const competitorsMatch = text.match(/경쟁사.*?:\s*(예?:?\s*(.+))/s);
    const uspMatch = text.match(/USP.*?:\s*(예?:?\s*(.+))/s);
    if (competitorsMatch?.[1]) result.competitors = competitorsMatch[1].trim();
    if (uspMatch?.[1]) result.usp = uspMatch[1].trim();

    return result;
  } catch (e) {
    console.error('예시 생성 실패:', e);
    return getDefaultExamples();
  }
}

/** 기본 예시 (API 키 없거나 실패 시) */
function getDefaultExamples(): CachedExamples {
  return {
    competitors: '경쟁 브랜드와 특징을 입력해주세요',
    usp: '경쟁사 대비 차별점을 입력해주세요',
    ceoVision: '브랜드의 비전/꿈을 입력해주세요',
    longTermGoal: '장기 목표를 입력해주세요',
    personalStory: '개인 스토리를 입력해주세요',
    uniqueStrength: '제품/서비스의 특장점을 입력해주세요',
    valueProposition: '고객에게 주는 핵심 가치를 입력해주세요',
    languageConstraint: '네이밍 제약이 있으면 입력해주세요',
    marketTrend: '현재 업계의 주요 흐름을 입력해주세요',
    timestamp: 0,
  };
}

/**
 * 업종별 예시 반환 (캐시优先)
 */
export async function getIndustryExamples(industry: IndustrySelection): Promise<CachedExamples> {
  // 빈 업종이면 기본값
  if (!industry.minor && !industry.medium && !industry.major) {
    return getDefaultExamples();
  }

  const cacheKey = getCacheKey(industry);

  // 캐시 있음 → 캐시 반환
  if (memoryCache[cacheKey]) {
    return memoryCache[cacheKey];
  }

  // 캐시 없음 → AI로 생성
  const examples = await generateExamplesViaAI(industry);
  memoryCache[cacheKey] = examples;

  // store에도 저장 (persistence)
  const setCachedExamples = useFormStore.getState().setCachedIndustryExamples;
  if (setCachedExamples) {
    setCachedExamples(cacheKey, examples);
  }

  return examples;
}

/**
 * 특정 필드의 업종별 예시 Placeholder 문자열 반환
 */
export async function getIndustryPlaceholder(
  field: 'competitors' | 'usp' | 'ceoVision' | 'longTermGoal' | 'personalStory' | 'uniqueStrength' | 'valueProposition' | 'languageConstraint',
  industry: IndustrySelection
): Promise<string> {
  const examples = await getIndustryExamples(industry);
  return examples[field] || examples.competitors;
}
