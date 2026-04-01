# Roadmap: 브랜드 네이밍 앱

## Overview

이 프로젝트는 소상공인을 위한 AI 브랜드 네이밍 웹앱을 3단계로 구축한다. 먼저 입력 UI와 레이아웃을 완성하고, 이어서 Gemini AI 기반 추천 엔진을 연동하며, 마지막으로 업로드 문서 기반 RAG 시스템을 구축하여 폐쇄형 지식 기반 추천을 완성한다.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation & Input UI** - 프로젝트 셋업, 70/30 레이아웃, 전체 입력 폼, 프리미엄 디자인
- [ ] **Phase 2: AI Recommendation Engine** - Gemini 연동, 브랜드명 추천 카드, 누적 컨텍스트 추천
- [ ] **Phase 3: RAG Knowledge Base** - 문서 업로드, 텍스트 추출, 폐쇄형 지식 기반 추천

## Phase Details

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

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation & Input UI | 0/3 | Planned | - |
| 2. AI Recommendation Engine | 0/? | Not started | - |
| 3. RAG Knowledge Base | 0/? | Not started | - |
