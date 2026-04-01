# Feature Landscape: 브랜드 네이밍 앱

**Domain:** AI-powered brand naming for small business owners (소상공인)
**Researched:** 2026-04-01
**Confidence:** MEDIUM-HIGH (based on competitor analysis + domain research)

## Industry Context

The brand naming tool market is dominated by keyword-in / names-out generators (Namelix, Namify, Wix, Shopify, Hootsuite, Canva). The Korean market has NAiMY (네이미) as the primary local competitor. The premium tier includes Atom (formerly Squadhelp) with crowdsourced + AI hybrid naming, and NameRobot with its 150+ tool suite and name scoring.

**What makes this project unique:** No existing tool takes structured persona inputs (philosophy, mission, slogan, owner vision) and progressively refines names as context deepens. Most tools use 1-5 keywords as input. This app's input richness is its core differentiator — and the closed-knowledge RAG system (uploaded branding documents) is something no consumer naming tool offers.

---

## Table Stakes (필수 기능 -- 없으면 사용자가 떠남)

Features users expect from any naming tool. Missing these makes the product feel broken.

### 입력 시스템

| Feature | Why Expected | Complexity | Notes |
|---------|-------------|------------|-------|
| 상품/가게 기본정보 입력 (업종, 위치, 규모, 상품, 가격대) | Every naming tool requires business context as input. Namelix asks for keywords + industry; NAiMY asks for 제품/업종 + 분위기. Users expect structured input. | Low | Form fields with dropdowns where possible for 업종/위치. Keep field count manageable (5-7 per section). |
| 사장님 정보 입력 (비전, 꿈, 5/10년 목표, 스토리) | Persona-based naming requires owner context. NameStormers calls this the "creative brief" — detailed background that human consultants gather. The app replaces consultant intake forms. | Low | Free-text textarea fields. Placeholder examples critical for guiding input. |
| 브랜드 페르소나 입력 (철학, 슬로건, 미션 등) | Core project requirement. Maps to existing 브랜드 페르소나 앱 fields. Maintains ecosystem consistency. | Medium | Must match existing app's field structure for interoperability. Some fields (철학, 미션) are abstract — need strong placeholder/example text. |
| 항목별 개별 제출 트리거 | Core value of the app ("입력할 때마다 즉시 결과"). Without per-field triggers, it's just another batch generator. | Low | Button or Enter-key trigger per section. Clear "추천 받기" affordance. |
| 입력 유효성 검사 | Users will submit empty or trivially short inputs. Garbage-in-garbage-out harms trust in recommendations. | Low | Minimum character counts, empty field blocking, gentle validation messages. |

### 추천 시스템

| Feature | Why Expected | Complexity | Notes |
|---------|-------------|------------|-------|
| 브랜드명 3개 이하 추천 (per input) | Every competitor shows multiple suggestions. 3 is the sweet spot — Namelix shows 20+ and causes choice overload. Keeping it to 3 or fewer prevents analysis paralysis (documented pitfall in brand naming UX). | Medium | Gemini API call with structured prompt. Response parsing + error handling. |
| 작명 사유 표시 (naming rationale) | This is what separates AI-assisted naming from random generators. NAiMY provides meaning explanations. Namify emphasizes "meaningful and contextual" suggestions. Users need to understand WHY a name was suggested to evaluate it. | Low | 2-3 sentence explanation per name. Gemini generates this alongside the name. |
| 기반 항목 표시 (which inputs drove this recommendation) | Unique to this app's progressive model. When card #7 appears, user needs to know it was triggered by "미션" input vs. "가격대" input. Builds trust and transparency. | Low | Tag or badge showing source input field(s). |
| 추천 카드 누적 (stacking in right panel) | Core layout requirement. Cards accumulate as user fills in more fields, creating a visual timeline of refinement. | Low | Scrollable right panel. Newest at top or bottom (test both — top is likely better for visibility). |
| 누적 컨텍스트 반영 | Each new recommendation should consider ALL previous inputs, not just the latest one. Namelix learns from saves; this app learns from accumulated inputs. | Medium | Prompt engineering: concatenate all filled fields into each API call. Token management as context grows. |
| 로딩 상태 표시 | API calls to Gemini take 1-3 seconds. Without loading indicators, users think app is broken. Standard UX expectation. | Low | Skeleton cards or spinner in the recommendation panel while waiting. |

### 지식 기반 (RAG)

| Feature | Why Expected | Complexity | Notes |
|---------|-------------|------------|-------|
| 브랜딩 자료 업로드 (PDF, DOCX) | Core requirement — "노트북LM 방식 폐쇄형 지식 기반". This is the app's knowledge foundation. Without it, recommendations are generic. | Medium | File upload UI + server-side processing. File type validation. |
| 업로드 자료 기반 추론 (closed RAG) | Names must be grounded in uploaded branding knowledge, not general AI knowledge. This is how the app ensures domain-expert quality. | High | RAG pipeline: document chunking, embedding, vector storage, retrieval at query time. Most complex single feature. |
| 업로드 상태/목록 표시 | User needs to see which documents are loaded and whether processing succeeded. | Low | File list with status indicators (uploading / processing / ready / error). |

### 레이아웃/UX

| Feature | Why Expected | Complexity | Notes |
|---------|-------------|------------|-------|
| 70/30 분할 레이아웃 | Core design requirement. Input-dominant layout reflects this is an input-rich app, not a gallery browser. | Low | CSS Grid or Flexbox. Responsive considerations for smaller screens. |
| 한 화면 스크롤 (single page, no tabs/steps) | Removes friction of multi-step wizards. Users see all input fields and can fill in any order. Supports non-linear input patterns. | Low | Vertical scroll with section headers. Sticky right panel for recommendations. |
| 심플하고 고급스러운 디자인 | Branding tool must LOOK like it understands branding. Cheap-looking UI undermines trust. NAiMY and Namelix both invest heavily in visual design. | Medium | Professional typography (Pretendard), deliberate whitespace, restrained color palette. CSS craftsmanship. |

---

## Differentiators (차별화 기능 -- 경쟁 우위)

Features that set this product apart. Not expected, but highly valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **점진적 정교화 (Progressive Refinement)** | THE core differentiator. No competitor does this. Namelix learns from saves (reactive); this app refines from accumulated persona inputs (proactive). Each new input visibly improves recommendation quality. Users can SEE the AI getting smarter as they fill in more fields. | Medium | Prompt engineering challenge: early recommendations (1-2 fields) must still be useful, not garbage. Needs graceful degradation with minimal input. |
| **추천 비교/선택 (Favorite/Bookmark)** | Namelix has save/heart. NAiMY has bookmarking. Users need to shortlist from accumulated cards. Without this, users lose track of good names buried in the scroll. | Low | Heart/star toggle on each card. Filtered view showing only favorites. |
| **추천 히스토리 타임라인** | Visual progression showing "with 2 fields filled, AI suggested X; with 5 fields, it suggested Y." Demonstrates the value of providing rich input. No competitor has this narrative view. | Medium | Timeline markers tied to input events. Visual connection between input and resulting cards. |
| **선택한 브랜드명 내보내기** | Professional output: export final selection with rationale and source inputs as a PDF or structured document. Useful for presenting to the 소상공인 client. | Low | PDF generation from card data. Include name + rationale + persona context. |
| **세션 저장/불러오기** | Users may not finish in one sitting. A 소상공인 consultation could span days. LocalStorage or server-side persistence. | Medium | For v1, localStorage is simplest. Risk: browser clearing loses data. Consider simple server persistence in v2. |
| **프롬프트 투명성** | Show the constructed prompt sent to Gemini (optional toggle). Builds trust with power users. Unique among consumer tools. | Low | Collapsible section or modal showing the prompt text. Educational value for 사내 직원 understanding the AI. |
| **입력 완성도 표시 (Progress Indicator)** | Show how many persona fields are filled vs. available. Gamification of input completeness encourages richer input, which leads to better names. | Low | Progress bar or percentage. "7/15 fields filled" style. |
| **카드 간 비교 뷰** | Side-by-side comparison of 2-3 selected cards. Helpful when deciding between finalist names. | Low | Modal or expanded view comparing selected cards. |
| **네이밍 스타일 힌트** | After generating names, tag them with naming technique types (합성어, 순우리말, 외래어 변형, 두문자어 등). NAiMY uses 10 naming techniques; NameRobot categorizes by real words, compound words, made-up words, acronyms. Educational + helpful for filtering. | Low | Classification tags on each card. Can be generated by Gemini alongside the name. |

---

## Anti-Features (의도적으로 만들지 않을 것)

Features to explicitly NOT build. Each omission is deliberate.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **실시간 자동 추천 (auto-generate on keystroke)** | API cost explosion. UX chaos — cards appearing while user is mid-thought. Namelix and NAiMY both use explicit submit, not auto-generate. Debouncing helps but doesn't solve the conceptual problem: user should decide WHEN to get recommendations. | Explicit "추천 받기" button per section. User controls the pace. |
| **브랜드명 -> 페르소나 역방향** | Existing 브랜드 페르소나 앱 (brand-ashy-kappa.vercel.app) already does this. Building both directions creates scope creep and confusion about which tool to use. | Link/redirect to existing app for reverse workflow. |
| **도메인/SNS 가용성 체크** | Requires external API integrations (WHOIS, Instagram API, etc.). NAiMY does this but it's their primary product. For this app, it's a distraction from the core value (persona-based naming). Adds API complexity and cost. | v2 consideration. For v1, suggest users check manually or use NAiMY/Namelix for availability after selecting a name. |
| **상표 검색/등록 연동** | KIPRIS (한국특허정보원) API integration is non-trivial. Trademark checking is a legal-adjacent feature requiring accuracy guarantees. NAiMY and 마크인포 specialize in this. | Include a note/link: "선정한 브랜드명의 상표 등록 가능성은 KIPRIS 또는 마크인포에서 확인하세요." |
| **다국어 브랜드명 생성** | App is 한국어 전용 for 소상공인. Multilingual support (Namify does 8 languages) is unnecessary complexity. | Korean-only. If foreign-style names emerge naturally from Gemini, that's fine, but don't build multilingual input/output. |
| **협업/공유/팀 기능** | v1 is for individual use by 사내 직원. Collaboration features (voting, commenting, shared sessions) add significant complexity. Atom has this but they're a full branding agency platform. | Single-user sessions. Share via export (PDF/text). |
| **로고 생성/미리보기** | Namelix, Namify, Design.com bundle logo generation. Tempting but massive scope creep. Logo generation is a separate product. | Focus purely on naming. Logo is a downstream concern. |
| **이름 점수/평가 시스템** | NameRobot's NameScore rates names on memorability, pronounceability, brand strength. Building a scoring algorithm is a research project unto itself. | Let the 작명 사유 (rationale) serve as qualitative evaluation. The human user decides quality. |
| **20+ 이름 대량 생성** | Most generators (Namelix, Wix, Shopify) show 20-50+ names. Research shows this causes analysis paralysis and overwhelm. 3 per input is deliberate and superior for this use case. | Max 3 names per input event. Quality over quantity. |

---

## Feature Dependencies

```
[Core Flow]
브랜딩 자료 업로드 --> RAG 인덱싱 --> 추천 시 참조
                                          |
기본정보 입력 ----+                        |
사장님 정보 입력 --+--> 누적 컨텍스트 구성 --> Gemini API 호출 --> 추천 카드 생성
페르소나 입력 ----+                                              |
                                                                 v
                                                          카드 누적 표시
                                                                 |
                                                          즐겨찾기/선택
                                                                 |
                                                          내보내기 (PDF)

[Independent Features - No Dependencies]
세션 저장/불러오기 (localStorage, 독립적)
입력 완성도 표시 (입력 필드 카운팅, 독립적)
프롬프트 투명성 (API 호출 데이터 표시, 독립적)

[Dependency Chain - Critical Path]
1. 문서 업로드 UI --> 2. 문서 처리/청킹 --> 3. 벡터 저장 --> 4. RAG 검색
   (이 체인이 가장 복잡하고 시간이 많이 걸림)

[Dependency Chain - Progressive Refinement]
1. 개별 항목 입력 --> 2. 컨텍스트 누적 로직 --> 3. 프롬프트 구성 --> 4. 추천 품질 향상
   (프롬프트 엔지니어링이 핵심)
```

---

## MVP Recommendation

### Phase 1: Core Loop (Must Ship)

1. **입력 폼 (기본정보 + 사장님 정보 + 페르소나)** -- table stakes, low complexity
2. **항목별 추천 트리거 + Gemini API 연동** -- table stakes, medium complexity
3. **추천 카드 (이름 + 사유 + 기반 항목)** -- table stakes, low complexity
4. **70/30 누적 레이아웃** -- table stakes, low complexity
5. **누적 컨텍스트 반영** -- table stakes, medium complexity (prompt engineering)

### Phase 2: Knowledge Foundation

6. **문서 업로드 + RAG 파이프라인** -- table stakes but highest complexity; can ship Phase 1 without it (Gemini uses general knowledge first, then RAG enhances it)

### Phase 3: Polish and Differentiation

7. **즐겨찾기/선택** -- differentiator, low complexity
8. **세션 저장/불러오기** -- differentiator, medium complexity
9. **입력 완성도 표시** -- differentiator, low complexity
10. **내보내기** -- differentiator, low complexity

### Defer to v2

- 추천 히스토리 타임라인 (interesting but not critical)
- 프롬프트 투명성 (nice to have)
- 카드 간 비교 뷰 (useful but secondary)
- 네이밍 스타일 힌트/태그 (enrichment)

### Rationale

The core loop (input -> recommend -> accumulate) is the product. It must work well before adding RAG complexity. RAG is essential for differentiated quality but is technically the hardest feature; isolating it in Phase 2 prevents it from blocking the core experience. Differentiators in Phase 3 are all low-complexity features that can be added incrementally.

---

## Competitive Landscape Reference

| Tool | Input Depth | Output Style | RAG/Custom Docs | Progressive Refinement | Korean Support |
|------|-------------|-------------|-----------------|----------------------|----------------|
| Namelix | 1-5 keywords | 20+ names, learns from saves | No | Reactive (save-based) | No |
| NAiMY (네이미) | Description + 업종/분위기 | AI names + meaning + SNS check | No | No | Yes (Korean-first) |
| NameRobot | Keywords + style preferences | Scored names + linguistic analysis | No | No | Limited |
| Atom (Squadhelp) | Creative brief + contest | Human + AI hybrid | No | Through iterations | No |
| Namify | Keywords + industry | Names + domain/trademark/social | No | No | No |
| **This App** | **15+ structured persona fields** | **3 names + rationale + source tags** | **Yes (closed RAG)** | **Yes (core value)** | **Yes (Korean-only)** |

This app occupies a unique position: deepest input structure, closed knowledge base, and progressive refinement. No existing tool combines all three.

---

## Sources

- [Namelix](https://namelix.com/) - Adaptive learning, card-based output
- [NAiMY 네이미](https://naimy.ai) - Korean-first naming, SNS/trademark checks, 70K users
- [NameRobot](https://www.namerobot.com/) - 150+ tools, NameScore scoring system
- [Atom (formerly Squadhelp)](https://atom.com/) - Full branding agency platform
- [Namify](https://namify.tech/) - Trademark + domain + social checking
- [Research.com - 15 Best AI Business Name Generators 2026](https://research.com/business/best-ai-business-name-generators)
- [NameStormers - AI Naming The Right Way](https://www.namestormers.com/ai-naming-the-right-way-to-use-ai-for-brand-and-product-names/) - Context engineering > prompt engineering
- [Frozen Lemons - Brand Naming Mistakes](https://www.frozenlemons.com/blog/brand-naming-mistakes-to-avoid-common-pitfalls-and-how-to-overcome-them) - Analysis paralysis, overwhelm pitfalls
- [Springer - AI Branding Platform with Persona/Scenario Methods](https://link.springer.com/article/10.1186/s40691-026-00461-2) - Academic validation of persona-based approach
- [TMAI 상표검토](https://tmai.kr/) - Korean trademark checking context
- [마크인포](https://markinfo.kr/) - Korean trademark registration context

---
*Researched: 2026-04-01*
