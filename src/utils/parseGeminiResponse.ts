// ─── AI 응답 파싱 순수 함수 (gemini.ts에서 추출) ─────────────────────────────

export interface SimpleResult {
  brandName: string;
  reasoning: string;
  validityScore?: number;
  namingTechnique?: string;
  meaningAnalysis?: string;
  reflectedInputs?: string[];
}

export interface DocBasedResult {
  candidates: {
    brandName: string;
    reasoning: string;
    validityScore: number;
    namingTechnique: string;
    meaningAnalysis: string;
    reflectedInputs: string[];
    documentReference: string;
    trademarkRiskLevel: string;
    trademarkGrade: string;
    trademarkNote: string;
  }[];
  consumerChecklist: string[];
  processNote: string;
}

/**
 * 문서 없는 경우 Gemini 응답 파싱 (SimpleResult[])
 * - 정상 JSON 배열 → 파싱
 * - 비어있으면 에러
 * - JSON이 아니면 배열 패턴 추출 시도
 */
export function parseSimpleResponse(raw: string): SimpleResult[] {
  if (!raw || raw.trim() === '') {
    throw new Error('AI 응답이 비어 있습니다.');
  }
  try {
    return JSON.parse(raw) as SimpleResult[];
  } catch {
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
    return JSON.parse(m[0]) as SimpleResult[];
  }
}

/**
 * 문서 있는 경우 Gemini 응답 파싱 (DocBasedResult)
 * - 정상 JSON 객체 → 파싱
 * - 비어있으면 에러
 * - JSON이 아니면 객체 패턴 추출 시도
 */
export function parseDocBasedResponse(raw: string): DocBasedResult {
  if (!raw || raw.trim() === '') {
    throw new Error('AI 응답이 비어 있습니다.');
  }
  try {
    return JSON.parse(raw) as DocBasedResult;
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
    return JSON.parse(m[0]) as DocBasedResult;
  }
}
