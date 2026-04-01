# Requirements: 브랜드 네이밍 앱

**Defined:** 2026-04-01
**Core Value:** 페르소나 항목을 채워갈수록 점점 정교해지는 브랜드명 추천

## v1.0 Requirements (Completed)

### 입력 -- 기본정보 (INPUT)

- [x] **INPUT-01**: 업종/카테고리 입력
- [x] **INPUT-02**: 위치/지역 입력
- [x] **INPUT-03**: 매장 규모 입력
- [x] **INPUT-04**: 주력 상품/서비스 입력
- [x] **INPUT-05**: 가격대 입력
- [x] **INPUT-06**: 타겟 고객 입력

### 입력 -- 사장님 정보 (OWNER)

- [x] **OWNER-01**: 사장님 비전/꿈 입력
- [x] **OWNER-02**: 5/10년 목표 입력
- [x] **OWNER-03**: 개인 스토리/동기 입력

### 입력 -- 브랜드 페르소나 (PERSONA)

- [x] **PERSONA-01**: 브랜드 철학 입력
- [x] **PERSONA-02**: 슬로건 입력
- [x] **PERSONA-03**: 미션 입력
- [x] **PERSONA-04**: 기존 앱의 나머지 페르소나 항목 (브랜드명 제외)

### 레이아웃 (LAYOUT)

- [x] **LAYOUT-01**: 왼쪽 70% 입력 패널 / 오른쪽 30% 추천 패널
- [x] **LAYOUT-02**: 왼쪽 패널 -- 한 화면 세로 스크롤
- [x] **LAYOUT-03**: 오른쪽 패널 -- 추천 카드 누적 (최신이 상단)
- [x] **LAYOUT-04**: 심플하고 고급스러운 디자인 (Pretendard 폰트)

### 추천 시스템 (REC)

- [x] **REC-01**: 항목 입력 후 버튼 클릭 시 브랜드명 3개 이하 추천
- [x] **REC-02**: 추천마다 작명 사유 표시
- [x] **REC-03**: 추천마다 기반 항목 정보 표시 (어떤 입력을 근거로 했는지)
- [x] **REC-04**: 새 항목 입력 시 이전 입력 전체를 반영한 누적 추천
- [x] **REC-05**: 이전에 추천한 이름은 중복 추천하지 않음

### AI 연동 (AI)

- [x] **AI-01**: Gemini 3.1 Pro API 연동
- [x] **AI-02**: API 키는 서버사이드에서 관리 (보안)
- [x] **AI-03**: 로딩 상태 표시 (추천 생성 중)

### RAG 지식 기반 (RAG)

- [x] **RAG-01**: 브랜딩 서적/자료 PDF 업로드
- [x] **RAG-02**: 업로드된 자료만 참조하여 브랜드명 추론 (폐쇄형)
- [x] **RAG-03**: 업로드 자료 관리 화면 (목록, 삭제)
- [x] **RAG-04**: 업로드 후 텍스트 추출 미리보기

## v1.1 Requirements

### 산업분류 (INDUSTRY)

- [x] **INDUSTRY-01**: 사용자가 대분류 > 중분류 > 소분류 3단 계층형 드롭다운으로 업종을 선택할 수 있다
- [x] **INDUSTRY-02**: 247개 소분류 산업분류 데이터가 정적 TypeScript 파일로 포함된다
- [x] **INDUSTRY-03**: 기존 localStorage 데이터가 새 IndustrySelection 스키마로 자동 마이그레이션된다

### 카드 그루핑 (GROUP)

- [ ] **GROUP-01**: 추천 카드가 소분류 업종별로 그룹 헤더와 함께 묶여 표시된다
- [ ] **GROUP-02**: 그룹을 클릭하면 접기/펼치기 애니메이션으로 전환된다
- [ ] **GROUP-03**: 업종을 변경하면 이전 업종 그룹이 자동으로 접힌다

### 모바일 반응형 (MOBILE)

- [ ] **MOBILE-01**: 모바일에서 입력(위) + 추천(아래) 세로 스택 레이아웃이 표시된다
- [ ] **MOBILE-02**: AppLayout의 하드코딩 min-w가 제거되고 lg: 브레이크포인트 반응형으로 전환된다
- [ ] **MOBILE-03**: 모바일에서 터치 타겟, 패딩, 폰트 크기 등 터치 UX가 최적화된다

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
| 모바일 앱 | 웹앱 우선, 반응형 웹으로 대응 |
| 다국어 브랜드명 | 한국어 전용 |
| SNS/도메인 가용성 체크 | v1 범위 초과 |
| 실시간 자동 추천 | 비용 낭비 + UX 혼란, 버튼 클릭 방식 |
| OCR (스캔 PDF) | 복잡도 높음, 텍스트 PDF만 지원 |
| 드롭다운 검색/필터 | 각 단계 20~30개로 충분히 탐색 가능 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INPUT-01~06 | Phase 1 (v1.0) | Complete |
| OWNER-01~03 | Phase 1 (v1.0) | Complete |
| PERSONA-01~04 | Phase 1 (v1.0) | Complete |
| LAYOUT-01~04 | Phase 1 (v1.0) | Complete |
| REC-01~05 | Phase 2 (v1.0) | Complete |
| AI-01~03 | Phase 2 (v1.0) | Complete |
| RAG-01~04 | Phase 3 (v1.0) | Complete |
| INDUSTRY-01 | Phase 4 (v1.1) | Complete |
| INDUSTRY-02 | Phase 4 (v1.1) | Complete |
| INDUSTRY-03 | Phase 4 (v1.1) | Complete |
| GROUP-01 | Phase 5 (v1.1) | Pending |
| GROUP-02 | Phase 5 (v1.1) | Pending |
| GROUP-03 | Phase 5 (v1.1) | Pending |
| MOBILE-01 | Phase 6 (v1.1) | Pending |
| MOBILE-02 | Phase 6 (v1.1) | Pending |
| MOBILE-03 | Phase 6 (v1.1) | Pending |

**Coverage:**
- v1.0 requirements: 29 total (all complete)
- v1.1 requirements: 9 total
- Mapped to phases: 9/9
- Unmapped: 0

---
*Requirements defined: 2026-04-01*
*Last updated: 2026-04-01 after v1.1 roadmap creation*
