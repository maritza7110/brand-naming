import { GoogleGenAI } from '@google/genai';
import { MODEL_NAME, API_TIMEOUT_MS } from './gemini';
import { useSettingsStore } from '../store/useSettingsStore';
import { useFormStore } from '../store/useFormStore';

/**
 * 소비자 테스트 체크리스트 항목 기준으로
 * 현재 입력 정보 기반 브랜드명 1개를 추천합니다.
 */
export async function generateForCriterion(
  criterion: string,
): Promise<{ brandName: string; reasoning: string }> {
  const settingsKey = useSettingsStore.getState().apiKey;
  const apiKey = settingsKey || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    throw new Error('설정에서 Gemini API 키를 입력해주세요.');
  }

  const { storeBasic, brandVision, product, persona, analysis, identity, expression } =
    useFormStore.getState();

  // 입력된 값만 간단히 요약
  const contextParts: string[] = [];
  if (storeBasic.industry.major) contextParts.push(`업종: ${storeBasic.industry.major}`);
  if (storeBasic.mainProduct) contextParts.push(`주력상품: ${storeBasic.mainProduct}`);
  if (brandVision.ceoVision) contextParts.push(`CEO비전: ${brandVision.ceoVision}`);
  if (product.uniqueStrength) contextParts.push(`특장점: ${product.uniqueStrength}`);
  if (persona.philosophy) contextParts.push(`브랜드철학: ${persona.philosophy}`);
  if (analysis.usp) contextParts.push(`USP: ${analysis.usp}`);
  if (identity.brandPersonality.length > 0)
    contextParts.push(`퍼스날리티: ${identity.brandPersonality.join(', ')}`);
  if (expression.namingStyle.length > 0)
    contextParts.push(`네이밍스타일: ${expression.namingStyle.join(', ')}`);

  const context = contextParts.length > 0 ? contextParts.join('\n') : '(입력된 정보 없음)';

  const already = useFormStore
    .getState()
    .batches.flatMap((b) => b.names.map((n) => n.brandName));
  const excludeLine =
    already.length > 0 ? `\n\n이미 추천한 이름은 제외: ${already.join(', ')}` : '';

  const prompt = `아래 사업 정보를 바탕으로, 특히 "${criterion}" 기준을 가장 잘 만족하는 브랜드명 1개만 추천하세요.

[사업 정보]
${context}${excludeLine}

이 기준에 집중해 이름을 고르고, 왜 이 기준을 잘 충족하는지 한 문장으로 설명하세요.`;

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      abortSignal: AbortSignal.timeout(API_TIMEOUT_MS),
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          brandName: { type: 'string', description: '브랜드명 (한글)' },
          reasoning: { type: 'string', description: '이 기준을 충족하는 이유 (한 문장)' },
        },
        required: ['brandName', 'reasoning'],
      },
    },
  });

  const raw = response.text ?? '';
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('AI 응답 파싱 실패');
    return JSON.parse(m[0]);
  }
}
