# Research Summary: 브랜드 네이밍 앱

## 핵심 결론

### Stack
- **React 19 + Vite + TypeScript + Tailwind CSS**
- **Gemini 3.1 Pro API** (생성 + 임베딩)
- **Zustand** 상태 관리
- **Vercel** 배포 (기존 앱과 동일)
- RAG: Gemini File Search API 또는 인메모리 벡터 검색
- 문서 파싱: pdf.js, mammoth.js

### Table Stakes
- 상품/가게 기본정보 + 사장님 정보 + 페르소나 항목 입력
- 항목 입력 시마다 브랜드명 3개 이하 추천
- 추천 카드 누적 (이름 + 사유 + 기반 항목)
- 70/30 분할 레이아웃, 한 화면 스크롤
- 노트북LM 방식 문서 업로드 + RAG
- 심플하고 고급스러운 CSS 디자인

### Architecture
- React SPA + Vercel Serverless Functions (API 키 보호)
- 클라이언트: 입력 UI + 추천 카드 표시
- 서버리스: Gemini API 프록시 + 문서 처리
- RAG: 업로드 문서 → 청킹 → 임베딩 → 검색 → 프롬프트 주입

### Watch Out For
1. **한국어 문서 청킹** — 문단/섹션 단위로 나눠야 의미 보존
2. **컨텍스트 폭발** — 입력 누적 시 토큰 한도 관리 필수
3. **브랜드명 반복** — 이전 추천 제외 + temperature 조정
4. **API 키 보안** — Vercel Edge Function으로 키 보호
5. **카드 과다** — 즐겨찾기/그룹핑으로 UX 관리
6. **PDF 파싱 실패** — 스캔 PDF 미지원 명시, 텍스트 미리보기 제공

## 빌드 순서 권장

| 순서 | 내용 | 의존성 |
|------|------|--------|
| Phase 1 | 프로젝트 셋업 + UI 레이아웃 + Gemini 연동 | 없음 |
| Phase 2 | RAG 시스템 (문서 업로드 + 검색) | Phase 1 |
| Phase 3 | 디자인 폴리싱 + UX 개선 | Phase 1, 2 |

---
*Synthesized: 2026-04-01*
