import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { SessionData } from '../../services/sessionService';

interface StatsSectionProps {
  sessions: SessionData[];
}

const CHART_COLORS = ['#B48C50', '#8B6E3A', '#C5A06B', '#6B5030', '#D4B485'];

const TOOLTIP_STYLE = {
  backgroundColor: '#1A1A1E',
  border: '1px solid #4A4440',
  borderRadius: '8px',
  color: '#E8E2DA',
};

function computeStats(sessions: SessionData[]) {
  // 1. 업종 분포: industry_id → 대분류 추출 → 빈도
  const industryCount: Record<string, number> = {};
  sessions.forEach(s => {
    if (s.industry_id) {
      const major = s.industry_id.split('/')[0];
      industryCount[major] = (industryCount[major] ?? 0) + 1;
    }
  });
  const industryData = Object.entries(industryCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // 2. 키워드 빈도: input_data에서 키워드 관련 필드 집계
  const keywordCount: Record<string, number> = {};
  sessions.forEach(s => {
    const keywords: string[] = [];
    const pk = s.input_data?.storeBasic?.productKeywords || s.input_data?.productKeywords;
    if (typeof pk === 'string' && pk.trim()) {
      keywords.push(...pk.split(',').map((k: string) => k.trim()).filter(Boolean));
    }
    if (s.industry_id) {
      const parts = s.industry_id.split('/');
      if (parts.length >= 2) keywords.push(parts[1]);
    }
    keywords.forEach(kw => {
      keywordCount[kw] = (keywordCount[kw] ?? 0) + 1;
    });
  });
  const keywordData = Object.entries(keywordCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // 3. 네이밍 스타일 빈도: input_data.expression.namingStyle 배열
  const styleCount: Record<string, number> = {};
  sessions.forEach(s => {
    const styles = s.input_data?.expression?.namingStyle;
    if (Array.isArray(styles)) {
      styles.forEach((st: string) => {
        styleCount[st] = (styleCount[st] ?? 0) + 1;
      });
    }
  });
  const styleData = Object.entries(styleCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return { industryData, keywordData, styleData };
}

const EMPTY_TEXT = '아직 데이터가 없습니다';
const CARD_CLASS = 'bg-[#1A1A1E] rounded-xl p-4 border border-white/5';
const TITLE_CLASS = 'text-[14px] font-semibold text-[#A09890] mb-3';
const EMPTY_CLASS = 'text-[14px] text-[#5A5550] text-center py-8';

export default function StatsSection({ sessions }: StatsSectionProps) {
  const { industryData, keywordData, styleData } = useMemo(
    () => computeStats(sessions),
    [sessions]
  );

  return (
    <section>
      <h3 className="text-[20px] font-semibold text-[#E8E2DA] mt-8 mb-6">나의 네이밍 통계</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 차트 1: 인기 키워드 (수평 BarChart) */}
        <div className={CARD_CLASS}>
          <p className={TITLE_CLASS}>인기 키워드</p>
          {keywordData.length === 0 ? (
            <p className={EMPTY_CLASS}>{EMPTY_TEXT}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={keywordData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#A09890', fontSize: 12 }}
                  width={80}
                />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#B48C50" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 차트 2: 업종 분포 (도넛 PieChart) */}
        <div className={CARD_CLASS}>
          <p className={TITLE_CLASS}>업종 분포</p>
          {industryData.length === 0 ? (
            <p className={EMPTY_CLASS}>{EMPTY_TEXT}</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {industryData.map((_entry, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 차트 3: 네이밍 스타일 (수직 BarChart) */}
        <div className={CARD_CLASS}>
          <p className={TITLE_CLASS}>네이밍 스타일</p>
          {styleData.length === 0 ? (
            <p className={EMPTY_CLASS}>{EMPTY_TEXT}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={styleData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#A09890', fontSize: 11 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fill: '#A09890', fontSize: 12 }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#C5A06B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}
