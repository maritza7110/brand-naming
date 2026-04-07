---
phase: 12-ai
plan: "01"
status: complete
started: 2026-04-08
completed: 2026-04-08
---

# Summary: MODEL_NAME 상수 변경 + CLAUDE.md 문서 동기화

## What was built

AI 모델을 `gemini-3-flash-preview`에서 `gemini-3.1-pro-preview`로 전환하고, CLAUDE.md 문서에 정확한 모델 ID를 명시하여 코드-문서 일치를 달성했다.

## Key files

### Created
(없음)

### Modified
- `src/services/gemini.ts` — MODEL_NAME 상수를 `gemini-3.1-pro-preview`로 변경
- `CLAUDE.md` — AI/RAG 스택 테이블에 정확한 모델 ID 추가

## Verification

- `gemini-3.1-pro-preview`가 `src/services/gemini.ts`에 존재 확인
- `gemini-3-flash-preview` 잔재가 소스 코드 전체에서 0건 확인
- `geminiCriteria.ts`의 `import { MODEL_NAME } from './gemini'` 정상 유지 확인
- CLAUDE.md와 소스 코드의 모델 ID 일치 확인
- `npx vite build` 성공 확인

## Self-Check: PASSED

## Commits
- `aa421ac` — feat(12-01): MODEL_NAME을 gemini-3.1-pro-preview로 변경
- `69b0bbe` — docs(12-01): CLAUDE.md에 정확한 모델 ID gemini-3.1-pro-preview 명시

## Deviations
없음. 플랜대로 정확히 실행됨.

## Issues
없음.
