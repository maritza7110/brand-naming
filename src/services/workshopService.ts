/**
 * Workshop Service
 * 심층 기획 워크숍의 AI 생성 로직
 */
import { GoogleGenAI } from '@google/genai';
import type { PersonaFieldKey, BuilderState } from '../types/workshop';
import type { IndustrySelection } from '../types/form';
import { useSettingsStore } from '../store/useSettingsStore';
import { PERSONA_FIELD_METADATA } from '../types/workshop';
import { MODEL_NAME } from './gemini';

// System instruction for workshop
const SYSTEM_INSTRUCTION = `당신은 세계 최고의 브랜드 전략가(CBO)입니다.
사용자의 간단한 아이디어에서 구체적이고 실행 가능한 브랜드 페르소나를 구축하는 것을 돕습니다.

[작업 원칙]
1. 업종특화: 사용자가 입력한 업종(치킨집, 카페, 미용실 등)에 맞는 구체적인 질문만 하세요.
2. 구체성: "좋은 시설", "맛있는 음식" 같은 추상적 표현 금지. 구체적 스펙과 묘사 사용.
3. 문제 해결: 해당 업종의 고객 Pain Point를 정의하고 해결책 제시.
4. 선언적: 부드러운 설명문이 아닌 확신에 찬 기획서 스타일.`;

// 업종별 Reference Example
const INDUSTRY_EXAMPLES: Record<string, string> = {
  치킨: `[치킨집 브랜드策划 Reference]
1. 브랜드철학: "바삭함의 과학". 우리는 튀김의 물리학을 정밀하게 연구한 브랜드입니다. 170도에서 3분, 이 crispy moment를 지키기 위해.
2. 핵심기술: "3단 유화 Twin Fry 시스템". 외酥内軟의 균형을 0.1초 단위로 제어하는 자체 개발 튀김 시스템.
3. 핵심전략: "프리미엄 치킨 + 커뮤니티 공간". 치킨은 간식이 아닌 한 끼로,坐下来喝酒하는 곳.
4. 기능적 혜택: "지하烟熏室 타파". 매장 전체空调으로 냄새가 옷에 안 붙는 쾌적한 환경.
5. 고객문화창조: 1단계(外酥内软의 맛) -> 2단계(坐下来喝酒하는 공간) -> 3단계(치킨 맛에 취한 리그).`,
  
  카페: `[카페 브랜드策划 Reference]
1. 브랜드철학: "완전히 다른 아침". 단순히 커피가 아닌, 하루를 바꾸는 리추얼을 제공합니다.
2. 핵심기술: "빈 스푼 1개에서 탄생한 더치 커피". 소량 다회抽出로 깊이 있는 맛.
3. 핵심전략: "차별화된 공간 + 소량 프리미엄". 일반 카페가 제공할 수 없는稀缺성.
4. 기능적 혜택: "가장 조용한 아침 7시". 혼자서도 편하게工作하는 자리.
5. 고객문화창조: 1단계(아침 리추얼) -> 2단계(작업 공간) -> 3단계(브랜드 커뮤니티).`,
  
  미용: `[미용실 브랜드策划 Reference]
1. 브랜드철학: "당신의第二个피부". 단순히 머리를 자르는 곳이 아닌, 피부를 관리하는 곳.
2. 핵심기술: "0.1mm 시술 정확도". 일본进口 투톱 장비로 색상 차이 0% 달성.
3. 핵심전략: "전문가 아닌 아티스트". 기술자而非, 예술가로서의 비전.
4. 기능적 혜택: "방문 1회로 确定당신의 스타일".後悔없는 선택.
5. 고객문화창조: 1단계(전문성) -> 2단계(아트) -> 3단계(라이프스타일).`,
  
  한식: `[한식 브랜드策划 Reference]
1. 브랜드철학: "현대적인 한식의 새로운 해석". 전통은 지키되, 표현은 새롭게.
2. 핵심기술: "低温調理 발효 기술". 12시간 저온 조리로食材 본연의 맛을引き出す.
3. 핵심전략: "한식 파인 다이닝". 일반 한식집과 감별되는 세련된 공간과 서비스.
4. 기능적 혜택: "가족 모임에서 비즈니스 미팅까지". 다양한场景 대응.
5. 고객문화창조: 1단계(새로운 한식 경험) -> 2단계(한식 문화 재해석) -> 3단계(글로벌 한식).`,
};

function getIndustryExample(industry: IndustrySelection): string {
  const minor = industry.minor?.toLowerCase() || '';
  const medium = industry.medium?.toLowerCase() || '';
  
  if (minor.includes('치킨') || medium.includes('치킨')) {
    return INDUSTRY_EXAMPLES['치킨'];
  }
  if (minor.includes('카페') || minor.includes('커피') || medium.includes('카페')) {
    return INDUSTRY_EXAMPLES['카페'];
  }
  if (minor.includes('미용') || minor.includes('헤어') || medium.includes('미용')) {
    return INDUSTRY_EXAMPLES['미용'];
  }
  if (minor.includes('한식') || medium.includes('한식')) {
    return INDUSTRY_EXAMPLES['한식'];
  }
  
  // Default: 카페 예시
  return INDUSTRY_EXAMPLES['카페'];
}

/**
 * 업종과 아이디어에 맞는 필드별 가이드 생성
 */
export async function generatePlanningGuides(
  idea: string,
  industry: IndustrySelection,
  brandName?: string
): Promise<Record<PersonaFieldKey, string[]>> {
  const apiKey = useSettingsStore.getState().apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API 키가 설정되지 않았습니다.');

  const fieldsList = PERSONA_FIELD_METADATA.map(f => `${f.key}: ${f.label}`).join('\n');
  const example = getIndustryExample(industry);
  const industryPath = [industry.major, industry.medium, industry.minor].filter(Boolean).join(' > ');

  const prompt = `
${SYSTEM_INSTRUCTION}

[브랜드 아이디어]: ${idea}
[업종]: ${industryPath}
${brandName ? `[브랜드명]: ${brandName}` : ''}

[주의사항]
- 위 업종에서만 나올 수 있는 구체적인 질문만 하세요.
- 추상적 일반 질문 금지. 예: "좋은 서비스를 제공하겠다"는 금지.

[${industry.minor || industry.medium} 업종 Reference Example]
${example}

[필요한 질문 항목]
${fieldsList}

[응답 형식 - JSON]
{
  "philosophy": ["질문1", "질문2", "질문3"],
  "slogan": ["질문1", "질문2", "질문3"],
  ...
}
모든 15개 필드에 대해 3개씩 질문 제공.
`;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  const text = response.text;
  if (!text) throw new Error('가이드 생성 실패');
  
  return JSON.parse(text) as Record<PersonaFieldKey, string[]>;
}

/**
 * 단일 필드의 AI 초안 생성
 */
export async function generateFieldDraft(
  fieldKey: PersonaFieldKey,
  idea: string,
  userInput: string,
  context: string,
  industry: IndustrySelection,
  brandName?: string
): Promise<string> {
  const apiKey = useSettingsStore.getState().apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API 키가 설정되지 않았습니다.');

  const fieldMeta = PERSONA_FIELD_METADATA.find(f => f.key === fieldKey);
  const example = getIndustryExample(industry);
  const industryPath = [industry.major, industry.medium, industry.minor].filter(Boolean).join(' > ');

  const prompt = `
${SYSTEM_INSTRUCTION}

[확정된 브랜드명]: ${brandName || '미정'}
[작성 중인 항목]: ${fieldMeta?.label || fieldKey} (${fieldMeta?.category})
[브랜드 아이디어]: ${idea}
[업종]: ${industryPath}

[${industry.minor || industry.medium} 업종 Reference Example]
${example}

[사용자의 기획 의도]
"${userInput}"

[참고 - 이미 확정된 다른 항목들]
${context || '(아직 확정된 항목 없음)'}

[요청]
- 최소 300자 이상의 구체적인 내용 작성
- 소제목, 불릿 포인트, 볼드체 활용
- 해당 업종에서만 사용 가능한 구체적 스펙/용어 사용

내용만 반환 (마크다운 없음).
`;

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
  });

  return response.text || '내용을 생성할 수 없습니다.';
}
