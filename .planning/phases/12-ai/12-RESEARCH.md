# Phase 12: AI 모델 업그레이드 - Research

**Researched:** 2026-04-08
**Domain:** Google Gemini API 모델 전환 (`@google/genai` SDK)
**Confidence:** HIGH

---

## Summary

현재 코드베이스는 `gemini-3-flash-preview` 모델을 사용하고 있다. 이 값은 `src/services/gemini.ts` 상단에 `MODEL_NAME` 상수로 선언되어 있고, `src/services/geminiCriteria.ts`가 이 상수를 `import`하여 재사용하는 구조다. 즉, 모델명을 바꾸려면 **단 한 곳** — `gemini.ts` 3번째 줄 — 만 수정하면 된다.

목표 모델 `gemini-3.1-pro-preview`는 2026년 2월 19일 GA 출시된 공식 모델이다. 기존 `gemini-3-pro-preview`(2026-03-09 종료)의 후속 모델로 공식 Google AI 문서에 등재되어 있다. `@google/genai` 1.x SDK의 `ai.models.generateContent({ model: MODEL_NAME, ... })` 호출 방식은 동일하게 유지되므로 API 인터페이스 변경은 없다.

CLAUDE.md에는 AI 스택으로 "Gemini 3.1 Pro API" 지정이 명시되어 있으나, 실제 소스 코드의 `MODEL_NAME`은 `gemini-3-flash-preview`로 불일치 상태다. AI-02 요건은 이 불일치를 CLAUDE.md와 소스 코드가 일치하도록 동기화하는 것을 요구한다.

**핵심 결론:** 변경은 `MODEL_NAME` 상수 값 1개 수정 + CLAUDE.md 모델명 표기 확인으로 완료된다. 추가적인 API 래핑, SDK 업그레이드, 스키마 변경은 불필요하다.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AI-01 | AI 모델이 gemini-3.1-pro-preview를 사용하여 추천 품질이 향상된다 | `MODEL_NAME` 상수를 `'gemini-3.1-pro-preview'`로 변경 — 단일 파일 1줄 수정으로 완료. `geminiCriteria.ts`는 동일 상수를 import하므로 자동 반영 |
| AI-02 | CLAUDE.md의 모델명이 실제 사용 모델과 일치한다 | CLAUDE.md Constraints 섹션의 "Gemini 3.1 Pro API" 표기가 이미 목표 모델을 가리키나, 스택 테이블의 SDK 행 설명을 코드 실제값과 동기화 확인 필요 |
</phase_requirements>

---

## Project Constraints (from CLAUDE.md)

| 제약 | 내용 |
|------|------|
| AI | Gemini 3.1 Pro API 사용 명시 |
| Tech Stack | React + Vite + TypeScript + Tailwind CSS 4.x |
| 파일 제한 | 모든 소스 파일 500줄 이하 |
| 언어 | 한국어 UI, 한국어 문서 |
| 금지 | OpenAI API, Next.js, Redux, Material UI/Ant Design |

---

## Standard Stack

### Core
| 라이브러리 | 현재 버전 | 용도 | 비고 |
|-----------|---------|------|------|
| `@google/genai` | ^1.47.0 | Gemini API 공식 SDK | 버전 업그레이드 불필요 |

### 모델 정보
| 모델 ID | 출시일 | 컨텍스트 | 출력 한도 | 상태 |
|---------|--------|---------|---------|------|
| `gemini-3-flash-preview` | 2025-12-17 | 1M tokens | — | 현재 사용 중 (교체 대상) |
| `gemini-3.1-pro-preview` | 2026-02-19 | 1,048,576 tokens | 65,536 tokens | **목표 모델 — GA** |

**설치:** 패키지 변경 없음. SDK 버전 그대로 유지.

---

## Architecture Patterns

### 현재 모델명 관리 구조

```
src/services/gemini.ts          ← MODEL_NAME 선언 (단일 소스)
src/services/geminiCriteria.ts  ← MODEL_NAME import하여 사용
```

`MODEL_NAME`은 `gemini.ts`에서 `export const`로 선언되고, `geminiCriteria.ts`가 이를 import한다. 모델명을 한 곳에서 관리하는 올바른 패턴이 이미 적용되어 있다.

### 변경 대상 (코드)

**`src/services/gemini.ts` 3번째 줄만 수정:**
```typescript
// 변경 전
export const MODEL_NAME = 'gemini-3-flash-preview';

// 변경 후
export const MODEL_NAME = 'gemini-3.1-pro-preview';
```

`generateContent` 호출 방식은 그대로 유지:
```typescript
// Source: https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview
const response = await ai.models.generateContent({
  model: MODEL_NAME,  // 상수 사용 — 변경 불필요
  contents: [...],
  config: { ... },
});
```

### 변경 대상 (문서)

CLAUDE.md Technology Stack 테이블의 `@google/genai` 행 설명에서 실제 사용 모델명 명시:
```markdown
| @google/genai | 1.x | Gemini 3.1 Pro API 공식 SDK (모델: gemini-3.1-pro-preview) | ★★★ |
```

### Anti-Patterns to Avoid
- **모델명을 여러 파일에 중복 하드코딩:** 이미 단일 `MODEL_NAME` 상수로 관리 중 — 이 패턴 유지
- **SDK 버전 업그레이드와 동시에 모델 교체:** 범위 확장 금지. 이번 Phase는 모델명 문자열 변경만

---

## Don't Hand-Roll

| 문제 | 만들지 말 것 | 사용할 것 | 이유 |
|------|------------|---------|------|
| 모델 버전 관리 | 버전 switch/fallback 로직 | `MODEL_NAME` 상수 단순 교체 | 이번 Phase 범위 외. 안정성 Phase(14)에서 처리 |
| API 호환성 검증 | 런타임 모델 탐색 코드 | 단순 문자열 변경 후 수동 테스트 | `gemini-3.1-pro-preview`는 GA 모델, API 서명 동일 |

---

## Common Pitfalls

### Pitfall 1: 모델명 오타
**What goes wrong:** `gemini-3.1-pro-preview` 철자 오류 시 API가 모델을 찾지 못해 `404 MODEL_NOT_FOUND` 에러 발생
**Why it happens:** 버전 번호에 점(`.`)이 포함된 모델명 — `3.1`을 `31`이나 `3-1`로 쓰는 실수
**How to avoid:** 공식 문서(https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview)에서 모델 ID를 복사·붙여넣기
**Warning signs:** `Error: models/gemini-3.1-pro-preview is not found` 에러 메시지

### Pitfall 2: CLAUDE.md와 소스 코드 불일치 재발
**What goes wrong:** AI-02 요건을 형식적으로만 처리하여 CLAUDE.md 표기가 모호하게 남음
**Why it happens:** CLAUDE.md Constraints 섹션은 "Gemini 3.1 Pro API"로 되어 있지만, 스택 테이블의 실제 모델 ID 명시가 없음
**How to avoid:** CLAUDE.md 스택 테이블에 정확한 모델 ID 문자열(`gemini-3.1-pro-preview`) 추가
**Warning signs:** "CLAUDE.md에 적혀있는 것과 코드가 다르다"는 팀원 혼란

### Pitfall 3: geminiCriteria.ts 누락
**What goes wrong:** `gemini.ts`만 변경하고 `geminiCriteria.ts`를 확인하지 않음
**Why it happens:** `geminiCriteria.ts`는 이미 `MODEL_NAME`을 import하므로 자동 반영되지만, import 경로가 깨지거나 별도 하드코딩이 있는지 확인하지 않으면 놓칠 수 있음
**How to avoid:** 변경 후 `grep -r "gemini-3-flash" src/` 실행하여 구 모델명 잔재 없는지 확인
**Warning signs:** `geminiCriteria.ts`에 `model: 'gemini-3-flash-preview'` 직접 문자열이 남아있는 경우

---

## Code Examples

### 변경 전/후 비교

```typescript
// Source: src/services/gemini.ts (line 3)
// 변경 전
export const MODEL_NAME = 'gemini-3-flash-preview';

// 변경 후
export const MODEL_NAME = 'gemini-3.1-pro-preview';
```

### API 호출 — 변경 없음 (확인용)

```typescript
// Source: https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview
// @google/genai 1.x SDK generateContent 시그니처는 모델 교체 후에도 동일
const ai = new GoogleGenAI({ apiKey });
const response = await ai.models.generateContent({
  model: MODEL_NAME,  // 'gemini-3.1-pro-preview'로 자동 반영
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  config: {
    systemInstruction: buildSystemInstruction(),
    responseMimeType: 'application/json',
    responseSchema: hasDocuments ? SCHEMA_DOC_BASED : SCHEMA_SIMPLE,
  },
});
```

---

## State of the Art

| 이전 접근 | 현재 접근 | 변경 시점 | 영향 |
|----------|---------|---------|------|
| `gemini-3-pro-preview` | `gemini-3.1-pro-preview` | 2026-02-19 GA | 이전 모델 2026-03-09 종료 |
| `gemini-3-flash-preview` | `gemini-3.1-pro-preview` (이번 Phase) | Phase 12 | 추론 품질 향상, 응답 속도는 flash 대비 다소 느릴 수 있음 |

**Deprecated:**
- `gemini-3-pro-preview`: 2026-03-09 종료, `gemini-3.1-pro-preview`로 자동 리디렉션됨

---

## Environment Availability

Step 2.6: SKIPPED — 이 Phase는 소스 코드 문자열 1개 변경과 문서 업데이트만 포함. 외부 종속성 없음. Gemini API 키는 기존 앱에서 이미 동작 중.

---

## Open Questions

1. **응답 속도 변화**
   - What we know: `gemini-3.1-pro-preview`는 Flash 대비 추론이 무거운 Pro 모델
   - What's unclear: 실제 사내 환경에서 응답 대기 시간이 체감될 만큼 길어지는지
   - Recommendation: 모델 교체 후 추천 버튼을 직접 눌러 응답 시간 체감 확인. 타임아웃 처리는 Phase 14(안정성 개선)에서 별도 처리

2. **`gemini-3.1-pro-preview-customtools` 변형 모델**
   - What we know: Google이 bash/custom tools 특화 변형 모델(`-customtools` suffix)도 공개
   - What's unclear: 이 앱의 function calling 패턴에 해당 변형이 더 적합한지
   - Recommendation: 기본 `gemini-3.1-pro-preview` 사용 유지. 이 앱은 structured output만 사용하며 custom tools 없음

---

## Sources

### Primary (HIGH confidence)
- https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview — 모델 ID, context window, 출시일 확인
- https://ai.google.dev/gemini-api/docs/models — 전체 모델 목록 및 ID 문자열 확인
- https://ai.google.dev/gemini-api/docs/changelog — 모델 릴리스 및 종료 일정 확인
- `src/services/gemini.ts` (현재 코드베이스) — 현재 `MODEL_NAME` = `gemini-3-flash-preview`, import/export 구조 확인
- `src/services/geminiCriteria.ts` (현재 코드베이스) — `MODEL_NAME` import 방식 확인

### Secondary (MEDIUM confidence)
- `CLAUDE.md` — AI 스택 명세 "Gemini 3.1 Pro API" 기재, 모델 ID 불일치 현황 확인

---

## Metadata

**Confidence breakdown:**
- 변경 범위: HIGH — 코드베이스 직접 확인, 단일 상수 변경으로 완료됨
- 모델 ID: HIGH — 공식 Google AI 문서에서 직접 확인
- API 호환성: HIGH — SDK 1.x 동일 인터페이스 사용 확인

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (모델 preview 상태이나 GA 출시 모델이므로 단기 변경 가능성 낮음)
