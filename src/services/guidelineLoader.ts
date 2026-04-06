import { parseDocument } from './documentParser';
import type { UploadedDocument } from '../store/useSettingsStore';

// Layer 1 문서만 로드 — AI 시스템 프롬프트에 주입
// doc_c / doc_d → 코드로 변환 (namingPrompts.ts, clicheDb.ts)
// doc_e / doc_f → 별도 페이지로 분리 (/consumer-test, /trademark)
// brand_naming_usage_guide → 개발자용 가이드, 런타임 불필요
const GUIDELINE_FILES = [
  'brand_naming_guidelines_detailed.pdf',
  'brand_naming_protocol.pdf',
];

/** /guidelines/ 폴더에서 지침 PDF를 로드하여 파싱한다. 없는 파일은 건너뛴다. */
export async function loadGuidelines(): Promise<UploadedDocument[]> {
  const results = await Promise.allSettled(
    GUIDELINE_FILES.map(async (filename) => {
      const res = await fetch(`/${filename}`);
      if (!res.ok) return null;
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'application/pdf' });
      return parseDocument(file);
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<UploadedDocument> =>
        r.status === 'fulfilled' && r.value !== null,
    )
    .map((r) => r.value);
}
