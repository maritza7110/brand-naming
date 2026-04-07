import type { VercelRequest, VercelResponse } from '@vercel/node';

const KIPRIS_BASE = 'http://plus.kipris.or.kr/openapi/rest/trademarkInfoSearchService/trademarkNameSearchInfo';
const ACCESS_KEY = (process.env.KIPRIS_ACCESS_KEY ?? '').trim();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const name = String(req.query.name ?? '본소').trim();
  if (!ACCESS_KEY) { res.status(500).json({ error: 'KIPRIS API 키 미설정' }); return; }

  const url = `${KIPRIS_BASE}?accessKey=${encodeURIComponent(ACCESS_KEY)}&trademarkName=${encodeURIComponent(name)}&numOfRows=5`;

  try {
    const response = await fetch(url);
    const xml = await response.text();
    // 원본 XML 중 첫 3000자를 그대로 반환
    res.status(200).json({ url: url.replace(ACCESS_KEY, '***'), xmlPreview: xml.substring(0, 3000) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
