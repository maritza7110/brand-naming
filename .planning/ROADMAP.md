# Roadmap: 브랜드 네이밍 앱 v2.0

## Milestones

- ✅ **v1.0 MVP** — 기초 UI 및 AI 추천 엔진 (shipped 2026-04-01)
- ✅ **v1.1 UX 개선** — 산업분류 및 모바일 반응형 (shipped 2026-04-02)
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
- **Plans:** 1/4 plans executed
Plans:
- [x] 08-01-PLAN.md — 타입 시스템 확장 + Zustand 스토어 확장 + 신규 UI 프리미티브
- [ ] 08-02-PLAN.md — 3단계 탭 위저드 UI + 신규 섹션 + InputPanel/NamingPage 전환
- [x] 08-03-PLAN.md — Gemini 프롬프트 고도화 + 구조화 응답 + 키워드 가중치
- [ ] 08-04-PLAN.md — Rationale 확장 카드 UI + EmptyState 업데이트 + 전체 검증

### Phase 9: Social Gallery & Collaboration
- [ ] **공유 시스템:** 네이밍 프로젝트의 공개 발행(Publish) 로직.
- [ ] **Public Gallery UI:** 타 사용자의 공유 데이터를 탐색할 수 있는 무한 스크롤 피드.
- [ ] **피드백 루프:** 좋아요, 댓글, 북마크 기능 구현.

### Phase 10: Refinement & Data Visualization
- [ ] **분류 필터링:** 고도화된 검색 및 태그 필터 시스템.
- [ ] **데이터 대시보드:** 나의 네이밍 트렌드 및 인기 키워드 시각화.
- [ ] **최종 QA & 배포:** 전체 프로세스 검증 및 v2.0 정식 런칭.

## Progress

| Phase | Milestone | Plans Complete | Status | Expected |
|-------|-----------|---------------|--------|-----------|
| 1-3. MVP | v1.0 | 3/3 | Complete | 2026-04-01 |
| 4-6. UX 개선 | v1.1 | 6/6 | Complete | 2026-04-02 |
| **7. Auth & DB** | **v2.0** | **3/3** | **Complete** | **2026-04-03** |
| **8. Naming Logic** | **v2.0** | **0/4** | **Planned** | **2026-04-10** |
| **9. Social Gallery** | **v2.0** | **0/1** | **Pending** | **2026-04-15** |
| **10. Refinement** | **v2.0** | **0/1** | **Pending** | **2026-04-20** |
