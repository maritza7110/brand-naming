# Roadmap: 브랜드 네이밍 앱

## Milestones

- ✅ **v1.0 MVP** - Phases 1-3 (shipped 2026-04-01)
- 🚧 **v1.1 UX 개선** - Phases 4-6 (in progress)

## Phases

<details>
<summary>v1.0 MVP (Phases 1-3) - SHIPPED 2026-04-01</summary>

- [x] **Phase 1: Foundation & Input UI** - 프로젝트 셋업, 70/30 레이아웃, 전체 입력 폼, 프리미엄 디자인
- [x] **Phase 2: AI Recommendation Engine** - Gemini 연동, 브랜드명 추천 카드, 누적 컨텍스트 추천
- [x] **Phase 3: RAG Knowledge Base** - 문서 업로드, 텍스트 추출, 폐쇄형 지식 기반 추천

</details>

**v1.1 UX 개선:**

- [ ] **Phase 4: 산업분류 계층형 드롭다운** - 247개 소분류 데이터 기반 3단 드롭다운, localStorage 마이그레이션
- [ ] **Phase 5: 추천 카드 그루핑** - 소분류 업종별 그룹 묶기, 접기/펼치기, 업종 변경 시 자동 접힘
- [ ] **Phase 6: 모바일 반응형** - 세로 스택 레이아웃, 반응형 전환, 터치 UX 최적화

## Phase Details

<details>
<summary>v1.0 MVP (Phases 1-3) - SHIPPED 2026-04-01</summary>

### Phase 1: Foundation & Input UI
**Goal**: 사용자가 상품정보, 사장님 정보, 브랜드 페르소나 전 항목을 심플하고 고급스러운 UI에서 입력할 수 있다
**Depends on**: Nothing (first phase)
**Requirements**: INPUT-01, INPUT-02, INPUT-03, INPUT-04, INPUT-05, INPUT-06, OWNER-01, OWNER-02, OWNER-03, PERSONA-01, PERSONA-02, PERSONA-03, PERSONA-04, LAYOUT-01, LAYOUT-02, LAYOUT-03, LAYOUT-04
**Success Criteria** (what must be TRUE):
  1. 사용자가 웹앱을 열면 왼쪽 70% / 오른쪽 30% 분할 레이아웃이 표시된다
  2. 사용자가 왼쪽 패널에서 기본정보 6개 항목(업종, 위치, 규모, 상품, 가격대, 타겟고객)을 모두 입력할 수 있다
  3. 사용자가 사장님 정보 3개 항목(비전, 목표, 스토리)과 페르소나 4개 항목(철학, 슬로건, 미션, 기타)을 입력할 수 있다
  4. 왼쪽 패널이 한 화면 세로 스크롤로 동작하며, Pretendard 폰트 기반 심플하고 고급스러운 디자인이다
  5. 오른쪽 패널이 추천 카드 누적 영역으로 비어있는 상태로 대기한다
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — 프로젝트 스캐폴딩 + 타입/스토어 + 5개 공용 UI 컴포넌트
- [x] 01-02-PLAN.md — 레이아웃 셸 + 4개 입력 섹션 + App.tsx 통합
- [x] 01-03-PLAN.md — 전체 UI 시각 검증 (사용자 체크포인트)

**UI hint**: yes

### Phase 2: AI Recommendation Engine
**Goal**: 사용자가 항목을 입력하고 추천 버튼을 누르면 Gemini AI가 브랜드명을 추천하고, 카드가 오른쪽에 누적된다
**Depends on**: Phase 1
**Requirements**: REC-01, REC-02, REC-03, REC-04, REC-05, AI-01, AI-02, AI-03
**Success Criteria** (what must be TRUE):
  1. 사용자가 입력 후 추천 버튼을 클릭하면 브랜드명 3개 이하가 추천된다
  2. 각 추천 카드에 브랜드명, 작명 사유, 기반 항목 정보가 표시된다
  3. 추가 항목 입력 후 재추천 시 이전 입력 전체를 반영하며 이전 추천명은 중복되지 않는다
  4. 추천 생성 중 로딩 상태가 표시되고, API 키가 클라이언트에 노출되지 않는다
  5. 추천 카드가 오른쪽 패널에 최신 순으로 누적된다
**Plans**: TBD
**UI hint**: yes

### Phase 3: RAG Knowledge Base
**Goal**: 사용자가 브랜딩 자료를 업로드하면 AI가 해당 자료만 참조하여 브랜드명을 추천한다
**Depends on**: Phase 2
**Requirements**: RAG-01, RAG-02, RAG-03, RAG-04
**Success Criteria** (what must be TRUE):
  1. 사용자가 브랜딩 서적/자료 PDF를 업로드할 수 있다
  2. 업로드 후 텍스트 추출 미리보기가 표시된다
  3. 업로드된 자료 목록을 확인하고 삭제할 수 있다
  4. 자료가 업로드된 상태에서 추천 시 업로드된 자료만 참조하여 브랜드명이 추론된다
**Plans**: TBD
**UI hint**: yes

</details>

### v1.1 UX 개선 (In Progress)

**Milestone Goal:** 산업분류 체계 기반 업종 선택, 추천 카드 소분류 그루핑, 모바일 반응형 레이아웃으로 사용성을 개선한다.

### Phase 4: 산업분류 계층형 드롭다운
**Goal**: 사용자가 247개 소분류 산업분류 데이터를 대분류 > 중분류 > 소분류 3단 계층형 드롭다운으로 탐색하여 업종을 선택할 수 있다
**Depends on**: Phase 3 (v1.0 완료)
**Requirements**: INDUSTRY-01, INDUSTRY-02, INDUSTRY-03
**Success Criteria** (what must be TRUE):
  1. 사용자가 대분류를 선택하면 해당하는 중분류 목록이 표시되고, 중분류를 선택하면 해당 소분류 목록이 표시된다
  2. 대분류를 변경하면 중분류와 소분류 선택값이 자동으로 초기화된다
  3. 기존 v1.0 사용자가 앱을 열면 기존 localStorage 데이터가 자동 마이그레이션되어 정상 작동한다
  4. 선택된 업종 정보(대/중/소분류 경로)가 AI 추천 프롬프트에 반영된다
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — 타입 정의 + 산업분류 데이터 + 스토어 액션/마이그레이션
- [x] 04-02-PLAN.md — 계층형 드롭다운 UI + AI 프롬프트 통합 + 시각 검증

**UI hint**: yes

### Phase 5: 추천 카드 그루핑
**Goal**: 추천 카드가 소분류 업종별로 그룹 묶여 표시되고, 사용자가 그룹을 접거나 펼칠 수 있으며 업종 변경 시 이전 그룹이 자동 접힌다
**Depends on**: Phase 4
**Requirements**: GROUP-01, GROUP-02, GROUP-03, RESET-01
**Success Criteria** (what must be TRUE):
  1. 오른쪽 추천 패널에서 같은 소분류 업종의 카드가 그룹 헤더 아래 묶여 표시된다
  2. 그룹 헤더를 클릭하면 해당 그룹이 애니메이션과 함께 접히거나 펼쳐진다
  3. 사용자가 업종을 변경하면 이전 업종의 카드 그룹이 자동으로 접힌다
  4. "네이밍 초기화" 버튼으로 모든 입력을 초기화하고 기존 추천 카드가 접힌 컨테이너로 묶인다
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — 타입 확장 + persist v2 마이그레이션 + 그룹핑 유틸 + RecommendGroup 컴포넌트
- [x] 05-02-PLAN.md — App.tsx 그룹 렌더링 통합 + 업종 변경 자동 접힘 + 네이밍 초기화 + 시각 검증

**UI hint**: yes

### Phase 6: 모바일 반응형
**Goal**: 모바일 기기에서 입력(위) + 추천(아래) 세로 스택 레이아웃이 표시되고 터치 UX가 최적화된다
**Depends on**: Phase 5
**Requirements**: MOBILE-01, MOBILE-02, MOBILE-03
**Success Criteria** (what must be TRUE):
  1. 1024px 미만 화면에서 입력 패널이 위, 추천 패널이 아래인 세로 스택 레이아웃으로 전환된다
  2. 데스크톱(1024px 이상)에서는 기존 70/30 좌우 분할 레이아웃이 유지된다
  3. 모바일에서 버튼, 드롭다운, 입력 필드의 터치 타겟이 충분히 크고 패딩/폰트 크기가 터치에 최적화된다
**Plans**: 2 plans

Plans:
- [x] 06-01-PLAN.md — 레이아웃 셸 반응형 전환 (AppLayout + InputPanel + RecommendPanel)
- [x] 06-02-PLAN.md — 내부 컴포넌트 터치 UX + 자동 스크롤 + 시각 검증

**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 4 -> 5 -> 6

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|---------------|--------|-----------|
| 1. Foundation & Input UI | v1.0 | 3/3 | Complete | 2026-04-01 |
| 2. AI Recommendation Engine | v1.0 | -/- | Complete | 2026-04-01 |
| 3. RAG Knowledge Base | v1.0 | -/- | Complete | 2026-04-01 |
| 4. 산업분류 계층형 드롭다운 | v1.1 | 2/2 | Complete |  |
| 5. 추천 카드 그루핑 | v1.1 | 2/2 | Complete   | 2026-04-01 |
| 6. 모바일 반응형 | v1.1 | 0/2 | Planning complete | - |
