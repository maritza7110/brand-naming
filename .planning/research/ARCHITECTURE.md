# Architecture Patterns

**Domain:** Brand Naming Web App with RAG (Gemini File Search) + Progressive AI Recommendations
**Researched:** 2026-04-01

## Recommended Architecture

### High-Level Overview

```
+-------------------------------------------------------------------+
|                        Vercel Platform                             |
|                                                                    |
|  +---------------------+       +-------------------------------+  |
|  |   React SPA (Vite)  |       |   Vercel Serverless Functions |  |
|  |                      |       |           (/api)              |  |
|  |  +-------+ +------+  |  HTTP |  +----------+ +-----------+  |  |
|  |  | Input | | Card |  | ----> |  | /api/    | | /api/     |  |  |
|  |  | Panel | | Panel|  |       |  | recommend| | documents |  |  |
|  |  | (70%) | | (30%)|  | <---- |  +----+-----+ +-----+-----+  |  |
|  |  +-------+ +------+  | SSE   |       |             |         |  |
|  +---------------------+       +---------|-------------|--------+  |
|                                          |             |           |
+------------------------------------------|-------------|----------+
                                           |             |
                              +------------|-------------|----------+
                              |        Gemini API                   |
                              |                                     |
                              |  +---------------+ +-----------+    |
                              |  | File Search   | | Generate  |    |
                              |  | Store (RAG)   | | Content   |    |
                              |  | (브랜딩 자료) | | (Streaming)|   |
                              |  +---------------+ +-----------+    |
                              +-------------------------------------+
```

### Architecture Decision: Managed RAG via Gemini File Search

**Use Gemini File Search Tool instead of building a custom RAG pipeline.** This is the single most impactful architecture decision for this project.

Gemini File Search is Google's managed RAG-as-a-Service, built directly into the Gemini API. It handles chunking, embedding, vector indexing, and retrieval automatically. The alternative -- building a custom pipeline with a vector database (Pinecone, Chroma, etc.), embedding model, and retrieval logic -- adds massive complexity with no benefit for this use case.

**Why this is correct for this project:**
- 100-person internal app, not internet-scale
- Branding documents are the only knowledge source (closed RAG)
- Gemini 3.1 Pro Preview explicitly supports File Search
- Free storage, $0.15/1M tokens for indexing only
- Supports 50+ file formats including PDF, DOCX, TXT
- Automatic citations (grounding metadata) for traceability
- Custom metadata filtering for document categorization

**What this eliminates from the architecture:**
- No vector database (Pinecone, Chroma, Qdrant, etc.)
- No embedding pipeline
- No chunking logic
- No retrieval/re-ranking code
- No document parsing library

**Confidence:** HIGH -- verified against official Gemini API documentation at ai.google.dev

---

## Component Boundaries

| Component | Responsibility | Communicates With | Location |
|-----------|---------------|-------------------|----------|
| **InputPanel** | Collects user inputs (3 categories), triggers recommendations | API Layer, RecommendationPanel | Frontend |
| **RecommendationPanel** | Displays accumulated brand name cards with streaming | API Layer | Frontend |
| **SettingsView** | Manages document uploads to File Search Store | API Layer | Frontend |
| **API Proxy Layer** | Secures Gemini API key, routes requests | Gemini API | Vercel Functions |
| **RecommendationService** | Builds prompts from inputs, calls Gemini with File Search | Gemini File Search + Generate | Serverless |
| **DocumentService** | Manages File Search Store CRUD and file uploads | Gemini File Search Store API | Serverless |
| **Gemini File Search Store** | Stores/indexes branding documents, performs retrieval | Gemini Generate Content | Google-managed |

---

## Detailed Component Design

### 1. Frontend: React SPA (Vite)

```
src/
  components/
    layout/
      AppLayout.jsx          # 70/30 split container
    input/
      InputPanel.jsx          # Scrollable left panel container
      BasicInfoSection.jsx    # 업종, 위치, 규모, 상품, 가격대
      OwnerInfoSection.jsx    # 비전, 꿈, 5/10년 목표, 스토리
      PersonaSection.jsx      # 철학, 슬로건, 미션 등
      InputField.jsx          # Reusable field with debounce
    recommendation/
      RecommendationPanel.jsx # Scrollable right panel
      BrandCard.jsx           # 브랜드명 + 작명사유 + 기반항목
      StreamingCard.jsx       # Card being actively streamed
    settings/
      SettingsView.jsx        # Document upload management
      FileUploader.jsx        # Drag-drop file upload
      DocumentList.jsx        # Uploaded document list
  hooks/
    useRecommendation.js      # Debounce + API call + stream parsing
    useDocuments.js           # Document CRUD operations
    useInputState.js          # Centralized form state
  services/
    api.js                    # HTTP client for /api/* endpoints
  App.jsx
  main.jsx
```

**Key design decisions:**

- **Single-page scroll layout, no routing needed.** The app has two views: the main 70/30 split and a settings overlay/modal for document management. React Router is unnecessary overhead.
- **Debounced input triggers.** Each field change triggers a recommendation after 800ms-1200ms of inactivity. This prevents API spam while feeling responsive. Use a custom `useDebounce` hook, not a library.
- **Streaming card rendering.** New recommendations stream in via Server-Sent Events (SSE) or chunked response parsing. The currently-streaming card renders at the top of the right panel with a typing animation.
- **Accumulated cards.** Cards stack vertically in the right panel, newest on top. Each card shows which input fields influenced it.

### 2. API Proxy Layer (Vercel Serverless Functions)

```
api/
  recommend.js        # POST: Accept inputs, return streaming recommendation
  documents/
    upload.js         # POST: Upload file to File Search Store
    list.js           # GET: List documents in store
    delete.js         # DELETE: Remove document from store
  store/
    status.js         # GET: Check File Search Store health/stats
```

**Why serverless, not a dedicated backend:**
- The existing brand persona app deploys on Vercel
- No persistent state needed (Gemini manages the File Search Store)
- 100 users, low concurrency -- serverless is cost-effective
- API key stays server-side, never exposed to browser
- Zero infrastructure management

**Key design decisions:**

- **API key in environment variable.** Vercel encrypts env vars at rest. The `GEMINI_API_KEY` never reaches the browser.
- **Streaming via chunked transfer.** The `/api/recommend` endpoint uses `generateContentStream` and pipes chunks directly to the client response as Server-Sent Events.
- **File upload via multipart form data.** The `/api/documents/upload` endpoint receives files from the browser and proxies them to Gemini's `uploadToFileSearchStore`.

### 3. Recommendation Service (Core Logic)

This is the most architecturally important component. It lives in the serverless function but contains the prompt engineering and orchestration logic.

```javascript
// Pseudocode for /api/recommend.js

async function handleRecommend(req, res) {
  const { inputs, previousNames } = req.body;

  // 1. Build dynamic prompt from filled inputs
  const prompt = buildPrompt(inputs, previousNames);

  // 2. Call Gemini with File Search grounding
  const stream = await ai.models.generateContentStream({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      tools: [{
        fileSearch: {
          fileSearchStoreNames: [STORE_NAME]
        }
      }],
      systemInstruction: BRAND_NAMING_SYSTEM_PROMPT
    }
  });

  // 3. Stream response chunks to client
  res.setHeader('Content-Type', 'text/event-stream');
  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
  }

  // 4. Send grounding metadata (citations) at end
  // ... extracted from final response
  res.end();
}
```

**Progressive recommendation logic:**

The prompt dynamically adapts based on which inputs are filled:
- Few inputs (1-3 fields) --> broad, creative recommendations
- Medium inputs (4-8 fields) --> increasingly targeted
- Many inputs (9+ fields) --> highly specific, refined names

Previously recommended names are passed to avoid repetition.

### 4. Document Service (File Search Store Management)

```javascript
// Pseudocode for document management

// One-time setup: create the File Search Store
const store = await ai.fileSearchStores.create({
  config: { displayName: 'brand-naming-knowledge-base' }
});

// Upload with custom metadata for filtering
await ai.fileSearchStores.uploadToFileSearchStore({
  file: uploadedFile,
  fileSearchStoreName: store.name,
  config: {
    displayName: originalFilename,
    customMetadata: [
      { key: "category", stringValue: "branding-theory" },
      { key: "uploadedBy", stringValue: employeeName }
    ],
    chunkingConfig: {
      whiteSpaceConfig: {
        maxTokensPerChunk: 500,
        maxOverlapTokens: 50
      }
    }
  }
});
```

**Store lifecycle:**
- One shared File Search Store for the entire app (all 100 users share the same branding knowledge base)
- Store persists indefinitely (unlike raw File API uploads which expire in 48 hours)
- Admin/settings view manages documents -- upload new, list existing, delete outdated
- Custom metadata allows future filtering by category if needed

---

## Data Flow

### Flow 1: User Enters Input --> Brand Recommendation

```
1. User types in InputField (e.g., "카페" in 업종)
2. InputField updates local state immediately (responsive typing)
3. useDebounce waits 1000ms of inactivity
4. useRecommendation collects ALL filled inputs + previous brand names
5. POST /api/recommend with { inputs, previousNames }
6. Serverless function builds prompt from inputs
7. Calls Gemini generateContentStream with fileSearch tool
8. Gemini retrieves relevant chunks from branding documents
9. Gemini generates brand names grounded in retrieved context
10. Response streams back through serverless function as SSE
11. Frontend renders StreamingCard in real-time
12. On stream complete, card finalizes with citations
13. Card added to accumulated list, StreamingCard clears
```

### Flow 2: Admin Uploads Branding Document

```
1. Admin opens Settings view
2. Drags PDF/DOCX into FileUploader
3. Frontend sends multipart POST to /api/documents/upload
4. Serverless function receives file
5. Calls ai.fileSearchStores.uploadToFileSearchStore()
6. Polls operation status until indexing completes
7. Returns success with document metadata
8. Frontend updates DocumentList
```

### Flow 3: Recommendation with Citations

```
1. Gemini generates brand name using File Search
2. Response includes groundingMetadata with:
   - Source document references
   - Specific passage citations
   - Relevance scores
3. BrandCard displays:
   - 브랜드명 (brand name)
   - 작명사유 (naming rationale)
   - 기반 항목 (which inputs influenced this)
   - 참조 자료 (which branding documents were referenced)
```

---

## Patterns to Follow

### Pattern 1: Debounced Progressive Triggering

**What:** Each input field change triggers a new recommendation cycle after a debounce period.

**When:** Every field in the input panel.

**Implementation:**
```jsx
function useRecommendation(inputs) {
  const debouncedInputs = useDebounce(inputs, 1000);
  const [cards, setCards] = useState([]);
  const [streaming, setStreaming] = useState(null);

  useEffect(() => {
    if (!hasMinimumInputs(debouncedInputs)) return;

    const controller = new AbortController();

    async function fetchRecommendation() {
      setStreaming({ text: '', loading: true });

      const response = await fetch('/api/recommend', {
        method: 'POST',
        body: JSON.stringify({
          inputs: debouncedInputs,
          previousNames: cards.map(c => c.name)
        }),
        signal: controller.signal
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value);
        setStreaming({ text: accumulated, loading: false });
      }

      // Parse final result into structured card
      const card = parseRecommendation(accumulated);
      setCards(prev => [card, ...prev]);
      setStreaming(null);
    }

    fetchRecommendation();
    return () => controller.abort();
  }, [debouncedInputs]);

  return { cards, streaming };
}
```

### Pattern 2: Abort-on-New-Input

**What:** When a new input arrives while a previous recommendation is still streaming, abort the previous request and start a new one.

**Why:** Prevents stale recommendations from completing after the user has already provided more context. The newest inputs always produce the most relevant names.

### Pattern 3: Structured Output for Cards

**What:** Use Gemini's structured output (JSON schema) to ensure consistent card format.

**Implementation:**
```javascript
const brandCardSchema = {
  type: "object",
  properties: {
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          brandName: { type: "string" },
          rationale: { type: "string" },
          basedOn: { type: "array", items: { type: "string" } }
        }
      },
      maxItems: 3
    }
  }
};
```

Note: Structured output and streaming may have compatibility constraints. If structured JSON output cannot stream, use a two-phase approach: stream the text for UX, then parse the complete response into the card structure.

### Pattern 4: Single Shared File Search Store

**What:** All users share one Gemini File Search Store containing branding materials.

**Why:** The branding knowledge base is company-wide, not per-user. One store means one set of indexed documents that all recommendation calls reference.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Custom RAG Pipeline

**What:** Building your own vector database + embedding + retrieval pipeline.

**Why bad:** Adds Pinecone/Chroma, an embedding service, chunking logic, retrieval code, and re-ranking -- all of which Gemini File Search handles natively. For a 100-user internal app, this is massive over-engineering.

**Instead:** Use Gemini File Search Tool. It is purpose-built for exactly this use case.

### Anti-Pattern 2: Client-Side Gemini API Calls

**What:** Calling the Gemini API directly from the React frontend with an exposed API key.

**Why bad:** API keys in client-side JavaScript are trivially extractable. Even in an internal app, this creates a key leakage vector. Additionally, Gemini API keys now grant access to all File Search Store data.

**Instead:** All Gemini calls go through Vercel serverless functions. API key lives only in server environment variables.

### Anti-Pattern 3: Tab/Step Navigation for Input

**What:** Breaking inputs into wizard-style steps or tabs.

**Why bad:** The core UX is progressive refinement -- the user should see all fields and fill them in any order. Tabs create artificial barriers and hide the "fill-as-you-go" nature of the experience.

**Instead:** Single scrollable panel with all input sections visible. Each section is visually distinct but not gated.

### Anti-Pattern 4: Polling for Recommendations

**What:** Sending a POST, then polling GET until the response is ready.

**Why bad:** Adds latency, complexity, and server load for no benefit.

**Instead:** Use streaming (SSE or chunked transfer encoding) so the response appears in real-time as Gemini generates it.

### Anti-Pattern 5: Per-User Document Stores

**What:** Creating separate File Search Stores for each user.

**Why bad:** The branding knowledge base is shared company knowledge. Per-user stores means duplicated storage, inconsistent knowledge, and 100x the management overhead.

**Instead:** One shared store. If categorization is needed later, use custom metadata filtering.

---

## Suggested Build Order

Based on component dependencies, here is the recommended build sequence:

### Phase 1: Foundation (no AI yet)

1. **Vite + React project scaffold** -- baseline with Pretendard font, CSS variables
2. **AppLayout with 70/30 split** -- the shell that everything lives in
3. **InputPanel with all sections** -- static form with local state management
4. **RecommendationPanel with mock cards** -- display layer with hardcoded data

**Rationale:** Get the UI structure and state management right before adding AI complexity. The 70/30 layout is the core interaction model -- it must feel right before anything else.

### Phase 2: API Layer + Basic Recommendations

5. **Vercel serverless function scaffold** -- `/api/recommend` endpoint
6. **Gemini API integration** -- basic `generateContent` without File Search
7. **Streaming pipeline** -- end-to-end streaming from Gemini through serverless to frontend
8. **Debounced input triggering** -- connect inputs to recommendation API
9. **Card parsing and accumulation** -- structured rendering of streamed results

**Rationale:** This phase connects the frontend to AI without RAG. The progressive recommendation loop is the core feature -- it must work smoothly before adding document grounding.

### Phase 3: RAG (Document Grounding)

10. **File Search Store setup** -- create and configure the shared store
11. **Document upload API** -- `/api/documents/upload` with progress tracking
12. **Settings/admin view** -- document management UI
13. **File Search integration** -- add `fileSearch` tool to recommendation calls
14. **Citation rendering** -- show which documents influenced each recommendation

**Rationale:** RAG is an enhancement to already-working recommendations. Adding it last means the core loop is validated before introducing retrieval complexity.

### Phase 4: Polish

14. **Abort-on-new-input** -- cancel stale streams
15. **Error handling** -- API failures, upload failures, rate limits
16. **Loading states** -- skeleton cards, upload progress, indexing status
17. **CSS refinement** -- premium feel, animations, responsive tweaks

---

## Scalability Considerations

| Concern | At 10 users (dev) | At 100 users (target) | At 1000 users (future) |
|---------|--------------------|-----------------------|------------------------|
| Gemini API rate limits | No concern | Monitor usage, may need Tier 2 | Implement request queuing |
| File Search Store size | < 100MB | < 1GB (Free tier) | May need Tier 1 (10GB) |
| Serverless cold starts | Noticeable | Acceptable for internal app | Consider Vercel Pro for faster |
| Concurrent streams | No concern | 10-20 simultaneous OK | May need connection pooling |
| Document indexing | Instant | Minutes for large PDFs | Background job pattern |

For 100 users, no scaling concerns exist. Vercel's free/hobby tier and Gemini's Tier 1 are sufficient.

---

## Technology Constraints

### Gemini File Search Limitations (verified from official docs)

- **Not available in Live API** -- no real-time voice/video integration (not needed)
- **Cannot combine with Google Search or URL Context tools** -- fine, we want closed RAG
- **100MB max per document** -- sufficient for branding PDFs and books
- **Free tier: 1GB total store** -- sufficient for initial document corpus
- **Only Gemini 2.5+ and 3.x models** -- project uses 3.1 Pro Preview, which is supported
- **Structured output + streaming** -- may have compatibility limitations; test early

### Vercel Serverless Limitations

- **10-second default timeout** -- may need to increase for large document uploads
- **4.5MB request body limit** -- large file uploads need chunked approach or direct-to-Gemini upload
- **Cold starts** -- first request after idle period is slower; acceptable for internal app

---

## Sources

- [Gemini API File Search Documentation](https://ai.google.dev/gemini-api/docs/file-search) -- HIGH confidence, official docs
- [Gemini File Search Stores API](https://ai.google.dev/api/file-search/file-search-stores) -- HIGH confidence, official API reference
- [Gemini File Search JavaScript Tutorial](https://www.philschmid.de/gemini-file-search-javascript) -- MEDIUM confidence, third-party tutorial
- [Google Blog: File Search Tool](https://blog.google/innovation-and-ai/technology/developers-tools/file-search-gemini-api/) -- HIGH confidence, official announcement
- [@google/genai SDK](https://github.com/googleapis/js-genai) -- HIGH confidence, official repository
- [RAG Architecture Patterns 2026](https://www.rakeshgohel.com/blog/10-types-of-rag-architectures-and-their-use-cases-in-2026) -- MEDIUM confidence, industry analysis
- [NotebookLM Architecture](https://www.scribd.com/document/887551310/NotebookLM-Internal-Framework-Explained) -- MEDIUM confidence, analysis document
- [Vercel Vite Deployment](https://vercel.com/docs/frameworks/frontend/vite) -- HIGH confidence, official docs
- [Gemini API Key Security](https://trufflesecurity.com/blog/google-api-keys-werent-secrets-but-then-gemini-changed-the-rules) -- MEDIUM confidence, security analysis
