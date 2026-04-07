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
    // 분류코드 관련 태그 탐색
    const classTagCandidates = ['ClassificationCode', 'Classification', 'ClassCode', 'NiceClass', 'classCode'];
    const foundTags: Record<string, string[]> = {};
    for (const tag of classTagCandidates) {
      const re = new RegExp(`<${tag}>([^<]*)</${tag}>`, 'g');
      const vals: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = re.exec(xml)) !== null) vals.push(m[1].trim());
      if (vals.length > 0) foundTags[tag] = vals;
    }
    // 전체 태그 이름 추출
    const allTags = [...new Set((xml.match(/<([a-zA-Z]+)>/g) || []).map(t => t.slice(1, -1)))];
    res.status(200).json({
      totalInXml: xml.match(/TotalSearchCount>(\d+)/)?.[1],
      foundClassTags: foundTags,
      allTagNames: allTags,
      xmlFirst2000: xml.substring(0, 2000),
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
