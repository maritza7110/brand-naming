/**
 * doc_c_ai_prompts.pdf 코드 변환 (Layer 2)
 * PROMPT-01~07: 브랜드 네이밍 AI 프롬프트 패키지
 *
 * 사용 원칙:
 * - PROMPT_01 → 시스템 메시지 (세션 당 1회)
 * - PROMPT_02~07 → 순차 user 메시지
 * - temperature: 발산=1.1 / 필터·채점=0.1 / 설명=0.7
 * - {VARIABLE} 항목은 실제 값으로 치환
 */

// ─── PROMPT-01 · 마스터 시스템 프롬프트 ──────────────────────────────────
export const PROMPT_01_SYSTEM = `당신은 세계 최고 수준의 브랜드 네이밍 전문가(Brand Namer)입니다.
14개 글로벌·한국 네이밍 바이블을 완전히 내재화한 AI로서,
사용자의 브리프를 기반으로 전략적으로 최적화된 브랜드 이름을 생성하고 평가합니다.

핵심 원칙 (항상 적용)
1. 이름 생성보다 전략이 먼저다. 브리프의 업종·목표·페르소나를 먼저 분석한다.
2. 발산 단계에서는 자기검열을 완전히 배제한다. 평가는 별도 단계에서 수행한다.
3. 한국어와 글로벌 원칙 충돌 시 사용자의 주 시장에 따라 판단한다.
4. 상표 등록 가능성과 글로벌 안전성은 절대 요건이다. 타협하지 않는다.
5. 결과는 항상 요청된 JSON 형식으로 반환한다.

평가 기준 우선순위
[최우선] 상표 등록 가능성 · 글로벌 부정어 부재
[1순위] SMILE 5항목 (S제안성 M의미성 I이미지 L확장성 E감성공명)
[2순위] 기억 가능성 (음절수·리듬·시각독특성·이야기가능성)
[3순위] 전략 부합도 (가치어연상·페르소나일치·포지션차별)
[4순위] 한국어 특화 (음절구조·언어자원·소비자공명)
[5순위] 디지털 자산 (도메인·SNS핸들 가용성)

SCRATCH 자동 탈락
S(철자혼란) C(경쟁사모방) R(무연관) A(억지의미) T(밋밋) C(내부자전용) H(발음어려움)
— 하나라도 해당하면 즉시 탈락 —

출력 원칙
- 전문 용어보다 사장·창업자가 이해할 수 있는 언어 사용
- 점수와 판단에는 반드시 근거 제시
- 모든 결과는 요청된 JSON 형식으로만 반환`;

// ─── PROMPT-02 · 브리프 분석 ─────────────────────────────────────────────
export function buildPrompt02(params: {
  industryCategory: string;
  goalType: string;
  persona: string;
  coreValues: string;
  tabooWords: string;
  languageScope: string;
  syllableCount: string;
  trademarkCountry: string;
}): string {
  return `다음 브리프를 분석하여 네이밍 작업 방향을 결정해주세요.

입력 브리프
- 업종 카테고리: ${params.industryCategory}
- 목표·꿈 유형: ${params.goalType}
- 브랜드 페르소나: ${params.persona}
- 핵심 가치어: ${params.coreValues}
- 금기어: ${params.tabooWords}
- 언어 범위: ${params.languageScope}
- 희망 음절 수: ${params.syllableCount}
- 상표 등록 목표 국가: ${params.trademarkCountry}

아래 JSON 형식으로만 반환하세요:
{ "activated_principles": [{"id":"원칙ID","name":"원칙명","source":"바이블명","weight":1-5}],
  "name_type_priority": ["1순위","2순위","3순위"],
  "language_resource": {"primary":"주언어자원","secondary":"보조언어자원"},
  "phonetic_strategy": "음운 설계 방향 1~2문장",
  "forbidden_patterns": ["금지패턴1","금지패턴2"],
  "scoring_weights": {"A_smile":점수,"B_memory":점수,"C_strategy":점수,"D_legal":점수,"E_korean":점수,"F_digital":점수},
  "conflict_check": {"has_conflict":true/false,"conflict_type":"유형 또는 null","resolution":"해결규칙 또는 null"},
  "direction_summary": "네이밍 방향 요약 3~5문장" }
--- scoring_weights 6개 항목 합계 반드시 100 ---`;
}

// ─── PROMPT-03 · 대량 발산 ────────────────────────────────────────────────
export function buildPrompt03(params: {
  directionSummary: string;
  priority1: string;
  priority2: string;
  priority3: string;
  tabooWords: string;
  clichePatterns: string;
}): string {
  return `다음 브리프를 기반으로 브랜드 이름 후보 100개 이상을 생성하세요.

브리프 방향 요약
${params.directionSummary}

이름 유형별 생성 목표
- ${params.priority1}: 40개 | ${params.priority2}: 35개 | ${params.priority3}: 25개

생성 규칙
1. 자기검열 없이 발산한다. 이상해 보여도 일단 포함한다.
2. 동일·지나치게 유사한 이름은 중복 제거한다.
3. 금기어 포함 이름은 생성하지 않는다: ${params.tabooWords}
4. 업종 금지 클리셰 패턴도 생성하지 않는다: ${params.clichePatterns}

{ "candidates": [{"id":"C001","name":"이름","romanization":"로마자","type":"유형","language":"고유어/한자어/외래어/신조어","syllables":음절수,"brief_note":"발상 근거 1문장"}], "total_count":총개수 }`;
}

// ─── PROMPT-04 · 1차 필터 ────────────────────────────────────────────────
export function buildPrompt04(params: {
  candidates: string;
  tabooWords: string;
  clichePatterns: string;
}): string {
  return `다음 후보 목록을 1차 탈락 기준으로 필터링하세요.

후보 목록
${params.candidates}

탈락 기준 (하나라도 해당하면 즉시 탈락)
T1: 발음 불가 — 한국어 음운 체계에서 정상 발음 불가
T2: 발음 다중성 — 2가지 이상으로 읽힐 수 있는 경우
T3: 금기어 포함: ${params.tabooWords}
T4: 명백한 SCRATCH-C — 업계 1위 브랜드명과 명백히 유사
T5: 명백한 SCRATCH-H — 발음 실패율 추정 50% 이상
T6: 업종 금지 클리셰: ${params.clichePatterns}
T7: 보통명사 단독 — 상표 등록 불가 수준의 식별력

{ "passed":[{"id":"C001","name":"이름"}], "eliminated":[{"id":"C002","name":"이름","reason_code":"T코드","reason":"탈락 이유"}], "pass_count":통과수, "filter_summary":"필터 결과 요약" }
--- 판단에 5초 이상 걸리면 일단 통과 처리 (속도가 핵심) ---`;
}

// ─── PROMPT-05 · 통합 채점 (Layer 4 루브릭) ──────────────────────────────
export function buildPrompt05(params: {
  passedCandidates: string;
  industry: string;
  goal: string;
  persona: string;
  coreValues: string;
  weights: string;
}): string {
  return `다음 후보들을 6개 영역 100점 만점으로 채점하세요.

채점 대상: ${params.passedCandidates}
브리프: 업종=${params.industry} | 목표=${params.goal} | 페르소나=${params.persona} | 핵심 가치어=${params.coreValues}
채점 가중치 (총합=100): ${params.weights}

영역별 채점 기준
A-SMILE: S(0-4) M(0-4) I(0-4) L(0-4) E(0-4)
B-기억도: 음절수(0-5) 리듬(0-5) 시각독특성(0-5) 이야기가능성(0-5)
C-전략: 가치어연상(0-8) 페르소나일치(0-6) 포지션차별(0-6)
D-법적: 식별력(조어10/암시8/임의6/기술2/보통명사0) 충돌예측(없음10/주의5/위험0)
E-한국어: 음절구조(0-4) 언어자원(0-3) 소비자공명(0-3)
F-디지털: .com추정(0-4) .kr추정(0-2) SNS핸들추정(0-4)
감점: S=-3 C=-5 R=-3 A=-2 T=-4 H=-5 글로벌부정어=-8 클리셰=-3

{ "scored_candidates": [{"id":"C001","name":"이름","scores":{"A":{"subtotal":소계},"B":{"subtotal":소계},"C":{"subtotal":소계},"D":{"subtotal":소계},"E":{"subtotal":소계},"F":{"subtotal":소계}},"deductions":[],"final_score":최종점수,"grade":"S/A/B/C/탈락","key_strength":"강점 1문장","key_weakness":"약점 1문장"}], "ranking":["1위ID","2위ID"], "grade_summary":{"S":수,"A":수,"B":수} }`;
}

// ─── PROMPT-06 · 이름 설명 생성 (최종 제시) ──────────────────────────────
export function buildPrompt06(params: {
  topCandidates: string;
  industry: string;
  goal: string;
  coreValues: string;
}): string {
  return `채점 S/A등급 상위 3~5개 후보에 대해 상세 설명을 생성하세요.
사장·창업자가 이해할 수 있는 언어로 작성합니다.

대상 후보: ${params.topCandidates}
브리프: 업종=${params.industry} | 목표=${params.goal} | 핵심 가치어=${params.coreValues}

각 후보에 대해:
1. 이름 내러티브 (왜 이 이름인가? 3~5문장, 감성적 언어)
2. 강점 TOP 3 (비전문가 언어)
3. 주의 사항
4. 슬로건 아이디어 1~2개
5. 상표 출원 권고 (즉시출원권장 / 검토후출원 / 전문가상담필요)

{ "explanations": [{"id":"C001","name":"이름","grade":"S","final_score":점수,"narrative":"내러티브","strengths":["강점1","강점2","강점3"],"considerations":["주의1"],"tagline_ideas":["슬로건1"],"trademark_recommendation":"즉시출원권장","trademark_reason":"이유"}], "final_recommendation":"최우선 추천 이름과 이유 2~3문장" }`;
}

// ─── PROMPT-07 · 원칙 충돌 해결 ──────────────────────────────────────────
export function buildPrompt07(params: {
  conflictType: string;
  principleA: string;
  principleB: string;
  marketScope: string;
  budget: string;
  brandLifespan: string;
  expansionPlan: string;
}): string {
  return `브리프 분석 중 원칙 충돌이 감지되었습니다. 해결 규칙을 적용하세요.

감지된 충돌
유형: ${params.conflictType} | 원칙A: ${params.principleA} | 원칙B: ${params.principleB}

브리프 컨텍스트
시장 범위: ${params.marketScope} | 마케팅 예산: ${params.budget}
브랜드 수명 목표: ${params.brandLifespan} | 브랜드 확장 계획: ${params.expansionPlan}

충돌 해결 규칙
충돌01(서술적): 예산<5천만 또는 로컬이면 서술적 허용.
충돌02(신조어vs이해): 장기+글로벌이면 신조어 우선. 단기+로컬이면 이해용이성.
충돌03(카테고리암시vs초월): 멀티확장예정이면 초월 우선.
충돌04(고유어vs글로벌): 내수중심이면 고유어. 글로벌이면 이중 네이밍 전략.
충돌05(짧은vs의미): 카테고리 포화이면 의미있는 3음절. 비포화이면 짧게.
충돌06(최초성vs상표): 상표 가능성 절대 우선.
충돌07(창의철자vs직관): 변형규칙 일관적이면 허용.

{ "conflict_type":"충돌번호 및 유형명", "winning_principle":"적용 원칙명", "losing_principle":"제외 원칙명", "decision_basis":"결정 근거", "application_instruction":"발산·채점 단계 적용 지시", "user_explanation":"사용자에게 보여줄 설명 2~3문장" }`;
}
