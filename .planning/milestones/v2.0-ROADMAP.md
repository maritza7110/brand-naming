# Roadmap: 브랜드 네이밍 앱 v2.0

## Milestones

- ✅ **v1.0 MVP** — 기초 UI 및 AI 추천 엔진 (shipped 2026-04-01)
- ✅ **v1.1 UX ���선** — 산업분류 및 모바일 반응형 (shipped 2026-04-02)
- 🚀 **v2.0 Logic & Social** — 논리적 프레임워크 및 소셜 기능을 통한 협업 (In Planning)

## Phases (v2.0)

### Phase 7: Foundation & Authentication
- **Goal:** Supabase 기반의 인증 인프라 구축 및 개인 대시보드 구현
- **Plans:** 3 plans
- [x] 07-01-PLAN.md — Supabase 연동 및 DB 스키마/RLS 설정
- [x] 07-02-PLAN.md — 인증(Auth) UI 및 전역 상태 관리 구현
- [x] 07-03-PLAN.md — 개인 대시보드 UI 및 데이터 연동 로직

### Phase 8: Strategic Naming Logic (Intelligence)
- **Goal:** 3단계 탭 위저드(분석-정체성-표현) 전환, 프롬프트 고도화, Rationale UI 추가
- **Plans:** 4/4 plans complete
Plans:
- [x] 08-01-PLAN.md — 타입 시스템 확장 + Zustand 스토어 확장 + 신규 UI 프리미티브
- [x] 08-02-PLAN.md — 3단계 탭 위저드 UI + 신규 섹션 + InputPanel/NamingPage 전환
- [x] 08-03-PLAN.md — Gemini 프롬프트 고도화 + 구조화 응답 + 키워드 가중치
- [x] 08-04-PLAN.md — Rationale 확장 카드 UI + EmptyState 업데이트 + 전체 검증

### Phase 9: Social Gallery & Collaboration

**Goal:** 네이밍 프로젝트의 공개 발행(Publish) + 무한 스크롤 갤러리 피드 + 좋아요/북마크 피드백 시스템 구축
**Requirements**: SOCIAL-PUBLISH, SOCIAL-GALLERY, SOCIAL-LIKE, SOCIAL-BOOKMARK
**Depends on:** Phase 7
**Plans:** 4/4 plans complete

Plans:
- [x] 09-01-PLAN.md — 타입 정의 + DB 마이그레이션 SQL + 서비스/스토어/훅 데이터 레이어
- [x] 09-02-PLAN.md — 대시보드 발행/철회 UI + 북마크 탭
- [x] 09-03-PLAN.md — 갤러리 페이지 + 카드 그리드 + 정렬 탭 + 무한 스크롤
- [x] 09-04-PLAN.md — 좋아요/북마크 버튼 + 상세 모달

### Phase 10: Refinement & Data Visualization

**Goal:** 갤러리 필터링(업종/스타일/키워드) + 댓글 피드백 + 대시보드 데이터 시각화(차트) + 인기 랭킹 리더보드 구현
**Requirements**: FILTER-DATA, FILTER-UI, COMMENT-DATA, COMMENT-UI, LEADERBOARD-DATA, LEADERBOARD-UI, STATS-UI
**Depends on:** Phase 9
**Plans:** 4/4 plans complete

Plans:
- [x] 10-01-PLAN.md — 타입 + DB 마이그레이션 + 서비스/스토어 데이터 레이어 (필터/리더보드/댓글)
- [x] 10-02-PLAN.md — 갤러리 FilterBar + Leaderboard UI + GalleryPage 통합
- [x] 10-03-PLAN.md — CommentSection + GalleryModal 댓글 통합
- [x] 10-04-PLAN.md — recharts 설치 + StatsSection + Dashboard 통계 시각화

### Phase 11: 위저드 탭 UX 재설계 — 3탭→4탭 전환, 페르소나 5그룹 분리, 탭 간 역할 명확화

**Goal:** 3탭 위저드를 4탭(분석/정체성/페르소나/표현)으로 재설계하고, 16개 페르소나 필드를 5그룹 컨테���너로 분리하며, 시장트렌드를 분석탭으로 이동하고, 관점 차이 배지로 중복 필드를 해소한다
**Requirements**: UX-TAB-REDESIGN, UX-PERSONA-TAB, UX-TAB-CONTENT-RESHUFFLE
**Depends on:** Phase 8
**Plans:** 3/3 plans complete

Plans:
- [x] 11-01-PLAN.md — TabId 타입 확장 + SectionHeader subtitle + WizardTabs 4탭 + NamingPage 라우팅
- [x] 11-02-PLAN.md — PersonaTab + 5개 페르소나 그룹 컴포넌트 생성
- [x] 11-03-PLAN.md — 분석탭 MarketTrend 이동 + 관점 배지 + 정체성탭 슬림화

## Progress

| Phase | Milestone | Plans Complete | Status | Expected |
|-------|-----------|---------------|--------|-----------|
| 1-3. MVP | v1.0 | 3/3 | Complete | 2026-04-01 |
| 4-6. UX 개선 | v1.1 | 6/6 | Complete | 2026-04-02 |
| **7. Auth & DB** | **v2.0** | **3/3** | **Complete** | **2026-04-03** |
| **8. Naming Logic** | **v2.0** | **4/4** | **Complete** | **2026-04-10** |
| **9. Social Gallery** | **v2.0** | **4/4** | **Complete** | **2026-04-15** |
| **10. Refinement** | **v2.0** | **0/4** | **Planned** | **2026-04-20** |
| **11. UX 재���계** | **v2.0** | **3/3** | **Complete** | **2026-04-06** |
