---
phase: quick
plan: 260406-nrr
type: execute
wave: 1
depends_on: []
files_modified:
  - src/services/guidelineStorage.ts
  - src/store/useSettingsStore.ts
  - src/components/settings/SettingsModal.tsx
  - src/services/gemini.ts
  - supabase/migrations/08_guidelines_storage.sql
autonomous: true
must_haves:
  truths:
    - "Vercel 배포 후에도 지침 문서가 모든 사용자에게 동일하게 보임"
    - "설정 화면에서 문서를 업로드하면 Supabase Storage에 저장됨"
    - "앱 시작 시 Supabase Storage에서 문서를 자동 다운로드하여 AI 프롬프트에 사용"
    - "문서 교체(덮어쓰기) 가능"
  artifacts:
    - path: "src/services/guidelineStorage.ts"
      provides: "Supabase Storage CRUD (upload, download, list, delete)"
    - path: "supabase/migrations/08_guidelines_storage.sql"
      provides: "guidelines 버킷 생성 + RLS 정책"
  key_links:
    - from: "src/components/settings/SettingsModal.tsx"
      to: "src/services/guidelineStorage.ts"
      via: "uploadGuideline / deleteGuideline 호출"
    - from: "src/store/useSettingsStore.ts"
      to: "src/services/guidelineStorage.ts"
      via: "loadGuidelinesFromStorage → documents 상태 갱신"
    - from: "src/services/gemini.ts"
      to: "src/store/useSettingsStore.ts"
      via: "getState().documents (기존 동일 — 변경 없음)"
---

<objective>
지침 문서(7개 PDF)를 localStorage에서 Supabase Storage로 이전하여 앱 종속 공유 스토리지로 전환한다.

Purpose: 현재 localStorage 기반이라 도메인/브라우저마다 문서가 달라지고 Vercel 배포 시 유실됨. Supabase Storage로 전환하면 모든 사용자가 동일한 지침 문서를 공유하고, 교체도 가능해짐.
Output: guidelineStorage.ts 서비스, 마이그레이션 SQL, 수정된 SettingsModal/useSettingsStore
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/services/supabase.ts
@src/store/useSettingsStore.ts
@src/services/documentParser.ts
@src/components/settings/SettingsModal.tsx
@src/services/gemini.ts

<interfaces>
<!-- gemini.ts는 useSettingsStore.getState().documents를 읽어 시스템 프롬프트를 빌드함 -->
<!-- documents의 타입: UploadedDocument[] -->

From src/store/useSettingsStore.ts:
```typescript
export interface UploadedDocument {
  id: string;
  name: string;
  type: 'txt' | 'pdf';
  content: string;          // 파싱된 텍스트 내용
  uploadedAt: string;       // ISO string
}
```

From src/services/supabase.ts:
```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

From src/services/gemini.ts (DOC_ROLE_MAP):
```typescript
const DOC_ROLE_MAP: Record<string, string> = {
  'brand_naming_guidelines_detailed': '[바이블 지침서] 14개 원칙과 평가 기준',
  'brand_naming_protocol':            '[운영 프로토콜] Layer 1~4 실행 절차',
  'brand_naming_usage_guide':         '[사용 가이드] 두 문서의 참조 시점 안내',
  'doc_c_ai_prompts':                 '[AI 프롬프트] PROMPT-01~07 단계별 지시문',
  'doc_d_cliche_db':                  '[클리셰 DB] 업종별 금지어·금지 패턴',
  'doc_e_consumer_test':              '[소비자 테스트] 최종 후보 체크리스트',
  'doc_f_trademark_guide':            '[상표 가이드] 식별력 등급·위험도 기준',
};
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Supabase Storage 서비스 + 마이그레이션 생성</name>
  <files>src/services/guidelineStorage.ts, supabase/migrations/08_guidelines_storage.sql</files>
  <action>
1. `supabase/migrations/08_guidelines_storage.sql` 생성:
   - `guidelines` 버킷을 Storage에 생성하는 SQL (INSERT INTO storage.buckets)
   - 버킷 설정: public=false, file_size_limit=52428800 (50MB), allowed_mime_types=['application/pdf','text/plain']
   - RLS 정책: SELECT는 모두 허용 (anon + authenticated), INSERT/UPDATE/DELETE는 authenticated만 허용
   - 정책 대상 테이블: storage.objects WHERE bucket_id = 'guidelines'

2. `src/services/guidelineStorage.ts` 생성 (새 파일, 서비스 레이어):
   - `import { supabase } from './supabase'`
   - `import { parseDocument } from './documentParser'` (PDF 파싱 재사용)
   - `import type { UploadedDocument } from '../store/useSettingsStore'`

   함수들:
   a) `listGuidelines(): Promise<string[]>` — `supabase.storage.from('guidelines').list()` 로 파일명 배열 반환
   
   b) `uploadGuideline(file: File): Promise<void>` — `supabase.storage.from('guidelines').upload(file.name, file, { upsert: true })` (덮어쓰기 허용). Content-Type 자동 설정.
   
   c) `deleteGuideline(filename: string): Promise<void>` — `supabase.storage.from('guidelines').remove([filename])`
   
   d) `downloadGuideline(filename: string): Promise<UploadedDocument>` — `supabase.storage.from('guidelines').download(filename)` 로 Blob 받고, `new File([blob], filename)` 으로 변환 후 `parseDocument(file)` 호출하여 UploadedDocument 반환. id는 `guideline-${filename}` 형식.
   
   e) `loadAllGuidelines(): Promise<UploadedDocument[]>` — listGuidelines() → 각 파일에 downloadGuideline() → Promise.all로 병렬 처리. 개별 실패는 console.error 후 skip (빈 배열 반환 가능).

   모든 함수에서 Supabase 에러 발생 시 throw new Error(한국어 메시지).
   파일 500줄 제한 준수.
  </action>
  <verify>
    <automated>npx tsc --noEmit src/services/guidelineStorage.ts 2>&1 | head -20</automated>
  </verify>
  <done>guidelineStorage.ts가 타입 에러 없이 컴파일되고, 마이그레이션 SQL이 존재</done>
</task>

<task type="auto">
  <name>Task 2: useSettingsStore + SettingsModal을 Supabase Storage 연동으로 전환</name>
  <files>src/store/useSettingsStore.ts, src/components/settings/SettingsModal.tsx</files>
  <action>
1. `src/store/useSettingsStore.ts` 수정:
   - `import { loadAllGuidelines, uploadGuideline, deleteGuideline } from '../services/guidelineStorage'`
   - documents 필드는 유지 (gemini.ts가 읽는 인터페이스 그대로)
   - persist 미들웨어에서 documents를 partialize로 제외: `partialize: (state) => ({ apiKey: state.apiKey })` — 문서는 더 이상 localStorage에 저장하지 않음
   - 새 상태 필드: `documentsLoading: boolean` (초기값 false), `documentsError: string | null` (초기값 null)
   - 새 액션:
     a) `loadDocuments: () => Promise<void>` — documentsLoading=true 설정 → loadAllGuidelines() 호출 → documents 상태 갱신 → documentsLoading=false. 에러 시 documentsError 설정.
     b) `uploadAndRefresh: (file: File) => Promise<void>` — uploadGuideline(file) 호출 후 loadDocuments() 재호출 (업로드 → 리로드 패턴)
     c) `removeAndRefresh: (filename: string) => Promise<void>` — deleteGuideline(filename) 호출 후 loadDocuments() 재호출
   - 기존 addDocument/removeDocument 액션 삭제 (더 이상 로컬 조작 없음)

2. `src/components/settings/SettingsModal.tsx` 수정:
   - 기존 addDocument → uploadAndRefresh 사용
   - 기존 removeDocument → removeAndRefresh 사용 (doc.name 전달)
   - handleFile 함수: parseDocument 호출 제거 → 대신 `uploadAndRefresh(file)` 직접 호출 (파싱은 loadDocuments 시 서버에서 다운로드 후 수행)
   - documentsLoading 상태 표시: 문서 목록 영역에 로딩 스피너/텍스트
   - documentsError 표시: 에러 메시지 렌더링
   - useEffect로 모달 open 시 loadDocuments() 호출 (최신 상태 반영)
   - 문서 목록 아이템의 삭제 버튼: `removeAndRefresh(doc.name)` 호출
   - uploading 상태는 그대로 유지 (업로드 중 UI 피드백)

3. gemini.ts는 변경 없음 — useSettingsStore.getState().documents 인터페이스가 동일하므로 기존 코드 그대로 작동.

4. 앱 초기 로딩 시 문서 자동 로드:
   - src/main.tsx 또는 App.tsx에서 앱 마운트 시 `useSettingsStore.getState().loadDocuments()` 호출 추가 (한 줄). 이렇게 하면 앱 시작과 동시에 Supabase에서 지침 문서를 가져옴.

파일 500줄 제한 준수.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1 | head -30</automated>
  </verify>
  <done>
- 설정 모달에서 PDF 업로드 시 Supabase Storage에 저장됨
- 앱 시작 시 Supabase Storage에서 문서를 자동 로드하여 documents 상태에 반영
- gemini.ts의 문서 기반 프롬프트가 기존과 동일하게 작동
- localStorage에는 더 이상 문서 content가 저장되지 않음 (apiKey만 persist)
  </done>
</task>

</tasks>

<verification>
1. `npx tsc --noEmit` — 전체 타입 체크 통과
2. `npm run build` — 빌드 성공
3. Supabase 대시보드에서 guidelines 버킷 확인 (마이그레이션 적용 후)
4. 앱 실행 후 설정 모달에서 PDF 업로드 → Supabase Storage에 파일 존재 확인
5. 새 브라우저/시크릿 모드에서 앱 열기 → 동일한 문서 목록 표시 확인
</verification>

<success_criteria>
- 지침 문서가 Supabase Storage에 중앙 저장되어 모든 사용자가 공유
- 문서 업로드/삭제/교체가 설정 화면에서 작동
- 앱 시작 시 자동 다운로드 + 파싱하여 AI 프롬프트에 사용
- localStorage에서 문서 데이터 제거 (API 키만 남음)
- 파일 500줄 제한 준수
</success_criteria>

<output>
After completion, create `.planning/quick/260406-nrr-supabase-storage/260406-nrr-SUMMARY.md`
</output>
