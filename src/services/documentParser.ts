import * as pdfjsLib from 'pdfjs-dist';
import type { UploadedDocument } from '../store/useSettingsStore';

// PDF.js 워커 설정 (CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

/** TXT 파일에서 텍스트 추출 */
async function parseTxt(file: File): Promise<string> {
  return file.text();
}

/** PDF 파일에서 텍스트 추출 */
async function parsePdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    pages.push(text);
  }

  return pages.join('\n\n');
}

/** 파일을 파싱하여 UploadedDocument 생성 */
export async function parseDocument(file: File): Promise<UploadedDocument> {
  const ext = file.name.split('.').pop()?.toLowerCase();

  let content: string;
  let type: 'txt' | 'pdf';

  if (ext === 'pdf') {
    content = await parsePdf(file);
    type = 'pdf';
  } else {
    content = await parseTxt(file);
    type = 'txt';
  }

  return {
    id: `doc-${Date.now()}`,
    name: file.name,
    type,
    content,
    uploadedAt: new Date().toISOString(),
  };
}
