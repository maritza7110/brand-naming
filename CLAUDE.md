<!-- GSD:project-start source:PROJECT.md -->
## Project

**브랜드 네이밍 앱**

소상공인의 상품정보, 사장님 정보, 브랜드 페르소나 항목을 하나씩 입력할 때마다 AI가 브랜드명을 추천하는 사내 웹앱. 기존 "브랜드 페르소나" 앱의 역방향 — 페르소나에서 브랜드명을 만들어간다. 100인 규모 회사 직원 누구나 사용.

**Core Value:** 페르소나 항목을 채워갈수록 점점 정교해지는 브랜드명 추천 — 입력할 때마다 즉시 결과를 보여주는 인터랙티브 경험.

### Constraints

- **Tech Stack**: React 웹앱 (기존 앱과 동일 스택)
- **AI**: Gemini 3.1 Pro API
- **디자인**: 심플 + 고급스러움, CSS 전문가 수준 퀄리티
- **사용자**: 100인 사내 직원
- **파일 제한**: 모든 소스 파일 500줄 이하
- **언어**: 한국어 UI, 한국어 문서
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## 추천 스택
### Frontend
| 기술 | 버전 | 이유 | 신뢰도 |
|------|------|------|--------|
| React | 19.x | 기존 앱과 동일, 팀 익숙함 | ★★★ |
| Vite | 6.x | 빠른 빌드, React 19 완벽 지원 | ★★★ |
| TypeScript | 5.x | 타입 안전성, 대규모 팀 협업 | ★★★ |
| Tailwind CSS | 4.x | 유틸리티 기반, 고급스러운 디자인 빠르게 구현 | ★★★ |
| Lucide React | 0.5x | 기존 앱과 동일 아이콘 셋 | ★★★ |
| Pretendard | latest | 기존 앱과 동일 한국어 폰트 | ★★★ |
### AI / RAG
| 기술 | 버전 | 이유 | 신뢰도 |
|------|------|------|--------|
| @google/genai | 1.x | Gemini 3.1 Pro API 공식 SDK (모델: gemini-3.1-pro-preview) | ★★★ |
| LangChain.js | 0.3.x | RAG 파이프라인 구축 (문서 로딩, 청킹, 검색) | ★★☆ |
| 대안: 직접 구현 | - | LangChain 없이 Gemini embedding + 벡터 검색 직접 구현 | ★★☆ |
### 벡터 저장소 (RAG용)
| 기술 | 이유 | 신뢰도 |
|------|------|--------|
| ChromaDB (in-memory) | 소규모 문서, 설치 간단, 브라우저 호환 | ★★☆ |
| Gemini Embedding API | 별도 임베딩 서버 불필요, 한국어 지원 양호 | ★★★ |
| 대안: Supabase pgvector | 서버사이드 필요하지만 확장성 좋음 | ★★☆ |
### 문서 처리
| 기술 | 이유 | 신뢰도 |
|------|------|--------|
| pdf.js | PDF 파싱 (브랜딩 서적) | ★★★ |
| mammoth.js | DOCX 파싱 | ★★☆ |
### 상태 관리
| 기술 | 이유 | 신뢰도 |
|------|------|--------|
| Zustand | 가볍고 심플, React 19 호환 | ★★★ |
| 대안: React Context | 소규모면 충분, 외부 의존성 없음 | ★★☆ |
### 배포
| 기술 | 이유 | 신뢰도 |
|------|------|--------|
| Vercel | 기존 앱과 동일 배포 환경 | ★★★ |
## 사용하지 말 것
| 기술 | 이유 |
|------|------|
| Next.js | SSR 불필요, SPA로 충분. 복잡도만 증가 |
| Redux | 이 규모에 과도함. Zustand로 충분 |
| Material UI / Ant Design | 고급스러운 커스텀 디자인 목표와 충돌 |
| OpenAI API | 요구사항이 Gemini 지정 |
| Pinecone | 클라우드 벡터DB는 사내 앱에 과도함 |
## 핵심 판단
- **경량 접근**: Gemini Embedding API + 인메모리 벡터 검색 (직접 구현)
- **프레임워크 접근**: LangChain.js로 RAG 파이프라인
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
