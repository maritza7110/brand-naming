# Requirements: 브랜드 네이밍 앱

**Defined:** 2026-04-01
**Core Value:** 페르소나 항목을 채워갈수록 점점 정교해지는 브랜드명 추천

## v1 Requirements

### 입력 -- 기본정보 (INPUT)

- [ ] **INPUT-01**: 업종/카테고리 입력
- [ ] **INPUT-02**: 위치/지역 입력
- [ ] **INPUT-03**: 매장 규모 입력
- [ ] **INPUT-04**: 주력 상품/서비스 입력
- [ ] **INPUT-05**: 가격대 입력
- [ ] **INPUT-06**: 타겟 고객 입력

### 입력 -- 사장님 정보 (OWNER)

- [ ] **OWNER-01**: 사장님 비전/꿈 입력
- [ ] **OWNER-02**: 5/10년 목표 입력
- [ ] **OWNER-03**: 개인 스토리/동기 입력

### 입력 -- 브랜드 페르소나 (PERSONA)

- [ ] **PERSONA-01**: 브랜드 철학 입력
- [ ] **PERSONA-02**: 슬로건 입력
- [ ] **PERSONA-03**: 미션 입력
- [ ] **PERSONA-04**: 기존 앱의 나머지 페르소나 항목 (브랜드명 제외)

### 추천 시스템 (REC)

- [ ] **REC-01**: 항목 입력 후 버튼 클릭 시 브랜드명 3개 이하 추천
- [ ] **REC-02**: 추천마다 작명 사유 표시
- [ ] **REC-03**: 추천마다 기반 항목 정보 표시 (어떤 입력을 근거로 했는지)
- [ ] **REC-04**: 새 항목 입력 시 이전 입력 전체를 반영한 누적 추천
- [ ] **REC-05**: 이전에 추천한 이름은 중복 추천하지 않음

### 레이아웃 (LAYOUT)

- [ ] **LAYOUT-01**: 왼쪽 70% 입력 패널 / 오른쪽 30% 추천 패널
- [ ] **LAYOUT-02**: 왼쪽 패널 -- 한 화면 세로 스크롤
- [ ] **LAYOUT-03**: 오른쪽 패널 -- 추천 카드 누적 (최신이 상단)
- [ ] **LAYOUT-04**: 심플하고 고급스러운 디자인 (Pretendard 폰트)

### RAG 지식 기반 (RAG)

- [ ] **RAG-01**: 브랜딩 서적/자료 PDF 업로드
- [ ] **RAG-02**: 업로드된 자료만 참조하여 브랜드명 추론 (폐쇄형)
- [ ] **RAG-03**: 업로드 자료 관리 화면 (목록, 삭제)
- [ ] **RAG-04**: 업로드 후 텍스트 추출 미리보기

### AI 연동 (AI)

- [ ] **AI-01**: Gemini 3.1 Pro API 연동
- [ ] **AI-02**: API 키는 서버사이드에서 관리 (보안)
- [ ] **AI-03**: 로딩 상태 표시 (추천 생성 중)

## v2 Requirements

### 고급 기능

- **ADV-01**: 추천 브랜드명 즐겨찾기/선택
- **ADV-02**: 세션 저장/불러오기
- **ADV-03**: 최종 선택 결과 PDF 내보내기
- **ADV-04**: 추천 히스토리 타임라인
- **ADV-05**: DOCX 문서 업로드 지원

## Out of Scope

| Feature | Reason |
|---------|--------|
| 브랜드명 -> 페르소나 역방향 | 기존 앱이 담당 |
| 사용자 인증/로그인 | 사내 앱, v1에서는 직접 접근 |
| 모바일 앱 | 웹앱 우선 |
| 다국어 브랜드명 | 한국어 전용 |
| SNS/도메인 가용성 체크 | v1 범위 초과 |
| 실시간 자동 추천 | 비용 낭비 + UX 혼란, 버튼 클릭 방식 |
| OCR (스캔 PDF) | 복잡도 높음, 텍스트 PDF만 지원 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INPUT-01 | Phase 1 | Pending |
| INPUT-02 | Phase 1 | Pending |
| INPUT-03 | Phase 1 | Pending |
| INPUT-04 | Phase 1 | Pending |
| INPUT-05 | Phase 1 | Pending |
| INPUT-06 | Phase 1 | Pending |
| OWNER-01 | Phase 1 | Pending |
| OWNER-02 | Phase 1 | Pending |
| OWNER-03 | Phase 1 | Pending |
| PERSONA-01 | Phase 1 | Pending |
| PERSONA-02 | Phase 1 | Pending |
| PERSONA-03 | Phase 1 | Pending |
| PERSONA-04 | Phase 1 | Pending |
| LAYOUT-01 | Phase 1 | Pending |
| LAYOUT-02 | Phase 1 | Pending |
| LAYOUT-03 | Phase 1 | Pending |
| LAYOUT-04 | Phase 1 | Pending |
| REC-01 | Phase 2 | Pending |
| REC-02 | Phase 2 | Pending |
| REC-03 | Phase 2 | Pending |
| REC-04 | Phase 2 | Pending |
| REC-05 | Phase 2 | Pending |
| AI-01 | Phase 2 | Pending |
| AI-02 | Phase 2 | Pending |
| AI-03 | Phase 2 | Pending |
| RAG-01 | Phase 3 | Pending |
| RAG-02 | Phase 3 | Pending |
| RAG-03 | Phase 3 | Pending |
| RAG-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 29
- Unmapped: 0

---
*Requirements defined: 2026-04-01*
*Last updated: 2026-04-01 after roadmap creation*
