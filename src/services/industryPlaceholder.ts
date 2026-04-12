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
아래 2개 항목에 대해 해당 업종에서 실제로 있을 법한 구체적인 예시를 각각 1개씩 작성해주세요.
형식: "예: [브랜드/서비스명] — [구체적 특징/강점]"

1. 경쟁사 예시 (경쟁 브랜드와 그 특징):
2. USP 예시 (우리만의 차별점):

[주의]
- 해당 업종에 실제로 존재하는 브랜드명可以使用
- 추상적이지 않고 구체적인 특징 포함
- 반드시 한국어로 작성

예시 (카페일 경우):
1. 경쟁사 예시: 예: 스타벅스, 블루보틀 — 프리미엄 원두와 공간 경험으로 선점
2. USP 예시: 예: 동네 Only 스페셜티 로스터리, 30분 내 픽업
`;

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = response.text?.trim() || '';
    
    // 응답 파싱
    const competitorsMatch = text.match(/1\.\s*경쟁사.*?:\s*(예?:?\s*(.+))/s);
    const uspMatch = text.match(/2\.\s*USP.*?:\s*(예?:?\s*(.+))/s);

    const competitors = competitorsMatch?.[1]?.trim() || getDefaultExamples().competitors;
    const usp = uspMatch?.[1]?.trim() || getDefaultExamples().usp;

    return {
      competitors,
      usp,
      timestamp: Date.now(),
    };
  } catch (e) {
    console.error('예시 생성 실패:', e);
    return getDefaultExamples();
  }
}

/** 기본 예시 (API 키 없거나 실패 시) */
function getDefaultExamples(): CachedExamples {
  return {
    competitors: '예: 업계领先 브랜드 — 제품特色과 시장포지셔닝',
    usp: '예: 동네 Only 특별한 강점, 고객이 만족하는サービス',
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
 * 특정 필드의 업종별 예시 Placeholder字符串 반환
 */
export async function getIndustryPlaceholder(
  field: 'competitors' | 'usp' | 'marketTrend',
  industry: IndustrySelection
): Promise<string> {
  const examples = await getIndustryExamples(industry);
  return examples[field] || examples.competitors;
}
