import type { VercelRequest, VercelResponse } from '@vercel/node';

const KIPRIS_BASE = 'http://plus.kipris.or.kr/openapi/rest/trademarkInfoSearchService/trademarkNameSearchInfo';
const ACCESS_KEY = process.env.KIPRIS_ACCESS_KEY ?? '';

function extractText(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return m ? m[1].trim() : '';
}

function extractAll(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}>([^<]*)<\/${tag}>`, 'g');
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) results.push(m[1].trim());
  return results;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const name = String(req.query.name ?? '').trim();
  const classCode = String(req.query.classCode ?? '').trim();
  if (!name) { res.status(400).json({ error: 'name 파라미터 필요' }); return; }
  if (!ACCESS_KEY) { res.status(500).json({ error: 'KIPRIS API 키 미설정' }); return; }

  let url = `${KIPRIS_BASE}?accessKey=${encodeURIComponent(ACCESS_KEY)}&trademarkName=${encodeURIComponent(name)}&numOfRows=5`;
  if (classCode) url += `&classification=${encodeURIComponent(classCode)}`;

  try {
    const response = await fetch(url);
    const xml = await response.text();

    const totalCount = parseInt(extractText(xml, 'TotalSearchCount') || '0', 10);
    const statuses = extractAll(xml, 'ApplicationStatus');
    const titles = extractAll(xml, 'Title');
    const applicants = extractAll(xml, 'ApplicantName');
    const appDates = extractAll(xml, 'ApplicationDate');

    const items = titles.map((title, i) => ({
      title,
      status: statuses[i] ?? '',
      applicant: applicants[i] ?? '',
      applicationDate: appDates[i] ?? '',
    }));

    res.status(200).json({ totalCount, items });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
