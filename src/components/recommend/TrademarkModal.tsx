import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, ShieldAlert, ShieldX, Loader2, ExternalLink } from 'lucide-react';
import { searchTrademark } from '../../services/kiprisService';
import type { TrademarkResult, TrademarkItem } from '../../services/kiprisService';

import { useFormStore } from '../../store/useFormStore';

interface Props { open: boolean; onClose: () => void; brandName: string; }

// ─── 업종 → 니스 상품류 코드 매핑 (핵심류 + 확장류) ──────────────────────────
interface NiceClassInfo {
  primary: string;   // 핵심 상품류
  expansion: string[]; // 사업 확장 시 필요한 류
  labels: Record<string, string>; // 류별 설명
}

const NICE_CLASS_MAP: Record<string, NiceClassInfo> = {
  // 식음료
  '카페':     { primary: '43', expansion: ['30', '35', '21'], labels: { '43': '음식점업', '30': '커피·차·음료', '35': '온라인유통·프랜차이즈', '21': '머그·텀블러' } },
  '커피':     { primary: '43', expansion: ['30', '35', '21'], labels: { '43': '음식점업', '30': '커피·차·음료', '35': '온라인유통·프랜차이즈', '21': '머그·텀블러' } },
  '음식점':   { primary: '43', expansion: ['29', '30', '35', '16'], labels: { '43': '음식점업', '29': '밀키트·가공식품', '30': '소스·양념', '35': '프랜차이즈·유통', '16': '포장재·인쇄물' } },
  '한식':     { primary: '43', expansion: ['29', '30', '35', '16'], labels: { '43': '음식점업', '29': '밀키트·반찬', '30': '소스·장류', '35': '프랜차이즈·유통', '16': '캐릭터·인쇄물' } },
  '치킨':     { primary: '43', expansion: ['29', '35', '16'], labels: { '43': '음식점업', '29': '냉동식품·밀키트', '35': '프랜차이즈·배달앱', '16': '캐릭터·인쇄물' } },
  '피자':     { primary: '43', expansion: ['29', '30', '35'], labels: { '43': '음식점업', '29': '냉동피자', '30': '소스·도우', '35': '프랜차이즈·유통' } },
  '베이커리': { primary: '43', expansion: ['30', '35', '16'], labels: { '43': '음식점업', '30': '빵·과자·디저트', '35': '프랜차이즈·온라인몰', '16': '포장재·캐릭터' } },
  '빵':       { primary: '43', expansion: ['30', '35'], labels: { '43': '음식점업', '30': '빵·과자류', '35': '온라인유통' } },
  '술집':     { primary: '43', expansion: ['33', '35'], labels: { '43': '음식점업', '33': '주류', '35': '유통·프랜차이즈' } },
  '식당':     { primary: '43', expansion: ['29', '30', '35', '16'], labels: { '43': '음식점업', '29': '밀키트·가공식품', '30': '소스·양념', '35': '프랜차이즈·유통', '16': '캐릭터·인쇄물' } },
  '분식':     { primary: '43', expansion: ['29', '30', '35'], labels: { '43': '음식점업', '29': '냉동분식', '30': '소스류', '35': '프랜차이즈' } },
  '일식':     { primary: '43', expansion: ['29', '35'], labels: { '43': '음식점업', '29': '수산가공', '35': '프랜차이즈·유통' } },
  '중식':     { primary: '43', expansion: ['29', '30', '35'], labels: { '43': '음식점업', '29': '냉동만두·가공식품', '30': '소스류', '35': '프랜차이즈' } },
  '양식':     { primary: '43', expansion: ['29', '30', '35'], labels: { '43': '음식점업', '29': '밀키트', '30': '소스·파스타', '35': '프랜차이즈' } },
  // 뷰티·미용
  '뷰티':     { primary: '03', expansion: ['35', '44'], labels: { '03': '화장품', '35': '온라인유통', '44': '미용서비스' } },
  '화장품':   { primary: '03', expansion: ['35', '05'], labels: { '03': '화장품', '35': '온라인유통', '05': '기능성화장품' } },
  '네일':     { primary: '44', expansion: ['03', '35'], labels: { '44': '미용서비스', '03': '네일제품', '35': '프랜차이즈' } },
  '헤어':     { primary: '44', expansion: ['03', '35'], labels: { '44': '미용서비스', '03': '헤어제품', '35': '프랜차이즈' } },
  '미용':     { primary: '44', expansion: ['03', '35'], labels: { '44': '미용서비스', '03': '화장품', '35': '프랜차이즈' } },
  // 의류·패션
  '의류':     { primary: '25', expansion: ['35', '18', '14'], labels: { '25': '의류', '35': '온라인유통', '18': '가방·잡화', '14': '액세서리' } },
  '패션':     { primary: '25', expansion: ['35', '18', '14'], labels: { '25': '의류', '35': '온라인유통', '18': '가방·잡화', '14': '액세서리' } },
  '신발':     { primary: '25', expansion: ['35'], labels: { '25': '신발', '35': '온라인유통' } },
  '가방':     { primary: '18', expansion: ['25', '35'], labels: { '18': '가방·잡화', '25': '패션의류', '35': '온라인유통' } },
  // IT
  'IT':       { primary: '09', expansion: ['42', '35'], labels: { '09': '소프트웨어·앱', '42': '기술서비스', '35': '플랫폼·유통' } },
  '소프트웨어': { primary: '09', expansion: ['42', '35'], labels: { '09': '소프트웨어', '42': 'SaaS', '35': '온라인서비스' } },
  '앱':       { primary: '09', expansion: ['42', '35'], labels: { '09': '앱', '42': '기술서비스', '35': '플랫폼' } },
  '플랫폼':   { primary: '42', expansion: ['09', '35'], labels: { '42': '기술서비스', '09': '소프트웨어', '35': '전자상거래' } },
  // 교육
  '교육':     { primary: '41', expansion: ['09', '16'], labels: { '41': '교육서비스', '09': '교육앱·콘텐츠', '16': '교재·인쇄물' } },
  '학원':     { primary: '41', expansion: ['09', '35'], labels: { '41': '교육서비스', '09': '교육앱', '35': '프랜차이즈' } },
  '온라인교육': { primary: '41', expansion: ['09', '35'], labels: { '41': '교육서비스', '09': '교육플랫폼', '35': '온라인유통' } },
  // 피트니스
  '피트니스': { primary: '41', expansion: ['28', '35'], labels: { '41': '체육서비스', '28': '운동기구', '35': '프랜차이즈' } },
  '헬스':     { primary: '41', expansion: ['28', '35'], labels: { '41': '체육서비스', '28': '운동기구', '35': '프랜차이즈' } },
  '요가':     { primary: '41', expansion: ['25', '35'], labels: { '41': '체육서비스', '25': '운동복', '35': '프랜차이즈' } },
  '필라테스': { primary: '41', expansion: ['28', '35'], labels: { '41': '체육서비스', '28': '운동기구', '35': '프랜차이즈' } },
  // 의료
  '의료':     { primary: '44', expansion: ['05', '10'], labels: { '44': '의료서비스', '05': '의약품', '10': '의료기기' } },
  '병원':     { primary: '44', expansion: ['05', '10'], labels: { '44': '의료서비스', '05': '의약품', '10': '의료기기' } },
  '한의원':   { primary: '44', expansion: ['05', '30'], labels: { '44': '의료서비스', '05': '한약', '30': '건강식품' } },
  '약국':     { primary: '05', expansion: ['44', '35'], labels: { '05': '의약품', '44': '의료서비스', '35': '유통' } },
  // 반려동물
  '반려동물': { primary: '31', expansion: ['35', '44'], labels: { '31': '사료·용품', '35': '펫유통·프랜차이즈', '44': '반려동물서비스' } },
  '펫':       { primary: '31', expansion: ['35', '44'], labels: { '31': '사료·용품', '35': '펫유통', '44': '반려동물서비스' } },
  // 세탁·물류·부동산
  '세탁':     { primary: '37', expansion: ['35'], labels: { '37': '세탁서비스', '35': '프랜차이즈' } },
  '청소':     { primary: '37', expansion: ['35'], labels: { '37': '청소서비스', '35': '프랜차이즈' } },
  '물류':     { primary: '39', expansion: ['35'], labels: { '39': '물류·운송', '35': '유통' } },
  '배송':     { primary: '39', expansion: ['35'], labels: { '39': '배송서비스', '35': '유통' } },
  '운송':     { primary: '39', expansion: ['35'], labels: { '39': '운송업', '35': '유통' } },
  '부동산':   { primary: '36', expansion: ['37', '42'], labels: { '36': '부동산', '37': '건설', '42': '설계·인테리어' } },
  '건설':     { primary: '37', expansion: ['36', '42'], labels: { '37': '건설', '36': '부동산', '42': '설계' } },
  '인테리어': { primary: '42', expansion: ['20', '35'], labels: { '42': '인테리어설계', '20': '가구', '35': '온라인유통' } },
};

// ─── F-1: 상표 식별력 5등급 (doc_f 기반) ───────────────────────────────────
const IDENTITY_GRADES = [
  { grade: '조어상표', desc: '완전히 새로 만든 단어 — 식별력 최강', dot: 'bg-emerald-400' },
  { grade: '임의상표', desc: '기존 단어를 상품과 무관하게 사용', dot: 'bg-sky-400' },
  { grade: '암시상표', desc: '특성을 암시하되 직접 설명하지 않음', dot: 'bg-amber-400' },
  { grade: '기술적상표', desc: '특성·품질을 직접 기술 — 등록 어려움', dot: 'bg-orange-400' },
  { grade: '보통명사', desc: '일반 명칭 — 단독 등록 불가', dot: 'bg-red-400' },
] as const;

// ─── F-4: 상표 위험도 5단계 ─────────────────────────────────────────────────
const RISK_LEVELS = [
  { level: 'SAFE',    label: '안전', desc: '동일·유사 선행 상표 없음, 즉시 출원 권장',     color: 'bg-emerald-500' },
  { level: 'LOW',     label: '낮음', desc: '유사 상표 1~2건, 전문가 확인 후 출원',         color: 'bg-lime-500' },
  { level: 'MEDIUM',  label: '보통', desc: '유사 상표 3건 이상, 변리사 상담 필요',          color: 'bg-amber-500' },
  { level: 'HIGH',    label: '높음', desc: '등록 상표 존재, 차별화 작업 필수',             color: 'bg-orange-500' },
  { level: 'BLOCKED', label: '차단', desc: '동일 등록 상표 다수, 법적 위험',               color: 'bg-red-600' },
] as const;

type RiskLevel = typeof RISK_LEVELS[number]['level'];

function calcRiskLevel(result: TrademarkResult): RiskLevel {
  if (result.totalCount === 0) return 'SAFE';
  const registered = result.items.filter((i) => i.status === '등록').length;
  if (registered >= 2) return 'BLOCKED';
  if (registered === 1) return 'HIGH';
  if (result.totalCount >= 3) return 'MEDIUM';
  return 'LOW';
}

// ─── 위험도 게이지 (다크 테마) ──────────────────────────────────────────────
function RiskGauge({ level }: { level: RiskLevel }) {
  const idx = RISK_LEVELS.findIndex((r) => r.level === level);
  const info = RISK_LEVELS[idx];
  const percent = ((idx + 1) / RISK_LEVELS.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <p className="text-[13px] font-semibold text-[#E8E2DA]">{info.label}</p>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${info.color}`}>{level}</span>
      </div>
      <div className="h-2 bg-[#4A4440] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-red-500 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex justify-between">
        {RISK_LEVELS.map((r, i) => (
          <div key={r.level} className="flex flex-col items-center gap-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${i <= idx ? r.color : 'bg-[#4A4440]'}`} />
            <span className="text-[9px] text-[#6A6460]">{r.label}</span>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-[#A09890]">{info.desc}</p>
    </div>
  );
}

// ─── 모달 본체 ──────────────────────────────────────────────────────────────
type SearchState = 'idle' | 'loading' | 'error' | 'done';

// 류별 조회 결과
interface ClassResult {
  classCode: string;
  label: string;
  result: TrademarkResult;
  riskLevel: RiskLevel;
}

export function TrademarkModal({ open, onClose, brandName }: Props) {
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [classResults, setClassResults] = useState<ClassResult[]>([]);
  const [overallRisk, setOverallRisk] = useState<RiskLevel | null>(null);

  if (!open) return null;

  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };

  document.body.style.overflow = 'hidden';

  // 업종에서 니스 분류 정보 조회
  function getNiceClassInfo(): NiceClassInfo | null {
    const { industry } = useFormStore.getState().storeBasic;
    const terms = [industry.minor, industry.medium, industry.major].filter(Boolean);
    for (const term of terms) {
      if (NICE_CLASS_MAP[term]) return NICE_CLASS_MAP[term];
      for (const [key, info] of Object.entries(NICE_CLASS_MAP)) {
        if (term.includes(key) || key.includes(term)) return info;
      }
    }
    return null;
  }

  const classInfo = getNiceClassInfo();
  const allClasses = classInfo ? [classInfo.primary, ...classInfo.expansion] : [];

  async function handleSearch() {
    setSearchState('loading');
    try {
      const results: ClassResult[] = [];
      // 핵심류 + 확장류 전부 조회
      for (const code of allClasses) {
        const data = await searchTrademark(brandName, code);
        const risk = calcRiskLevel(data);
        const label = classInfo?.labels[code] ?? `제${code}류`;
        results.push({ classCode: code, label, result: data, riskLevel: risk });
      }
      // 업종 없으면 전체 조회
      if (allClasses.length === 0) {
        const data = await searchTrademark(brandName);
        const risk = calcRiskLevel(data);
        results.push({ classCode: '-', label: '전체', result: data, riskLevel: risk });
      }
      setClassResults(results);
      // 전체 중 가장 높은 위험도를 종합 위험도로
      const riskOrder: RiskLevel[] = ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'BLOCKED'];
      const worst = results.reduce((max, r) => {
        const a = riskOrder.indexOf(max);
        const b = riskOrder.indexOf(r.riskLevel);
        return b > a ? r.riskLevel : max;
      }, 'SAFE' as RiskLevel);
      setOverallRisk(worst);
      setSearchState('done');
    } catch {
      setSearchState('error');
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleClose}>
      <div className="max-h-[85vh] overflow-y-auto px-4">
        <div
          className="relative w-full max-w-lg rounded-2xl bg-[#3E3A36] border border-[#4A4640] shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
        {/* 헤더 */}
        <div className="relative px-6 py-8 border-b border-[#504A44] shrink-0">
          <p className="absolute top-4 left-6 text-[13px] font-bold text-[#E8E2DA]">상표 조회</p>
          <button onClick={handleClose} className="absolute top-3 right-4 p-1.5 rounded-lg text-[#A09890] hover:bg-[#504A44] hover:text-[#B48C50] transition-colors">
            <X size={16} />
          </button>
          <p className="text-[30px] font-bold text-[#E8C878] text-center tracking-tight">{brandName}</p>
        </div>

        {/* 스크롤 바디 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* F-1: 식별력 등급 */}
          <div>
            <p className="text-[11px] font-semibold text-[#6A6460] uppercase tracking-widest mb-2">F-1 식별력 등급</p>
            <div className="space-y-1.5">
              {IDENTITY_GRADES.map((g) => (
                <div key={g.grade} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#2C2825] border border-[#4A4440]">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${g.dot}`} />
                  <span className="text-[12px] font-semibold text-[#D0CAC2] shrink-0">{g.grade}</span>
                  <span className="text-[11px] text-[#7A7570]">{g.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* F-4: KIPRIS 조회 */}
          <div className="border-t border-[#504A44] pt-4">
            <p className="text-[11px] font-semibold text-[#6A6460] uppercase tracking-widest mb-2">F-4 KIPRIS 실사 조회</p>

            {/* idle */}
            {searchState === 'idle' && (
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-[#2C2825] border border-amber-500/30">
                  <p className="text-[11px] text-amber-400 font-semibold mb-1">조회 범위</p>
                  {allClasses.length > 0 ? (
                    <div className="text-[11px] text-[#A09890] space-y-0.5">
                      <p>핵심: 제{classInfo!.primary}류 ({classInfo!.labels[classInfo!.primary]})</p>
                      <p>확장: {classInfo!.expansion.map(c => `제${c}류(${classInfo!.labels[c]})`).join(', ')}</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#A09890]">전체 상품류 조회 (업종 미선택)</p>
                  )}
                  <p className="text-[11px] text-[#6A6460] mt-1">동일 상표명만 조회 · 법적 효력 없음</p>
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full py-2.5 rounded-xl bg-[#7BAFD4]/20 text-[#7BAFD4] text-[13px] font-semibold hover:bg-[#7BAFD4]/30 transition-colors"
                >
                  KIPRIS 실사 조회 {allClasses.length > 0 ? `(${allClasses.length}개 류)` : ''}
                </button>
              </div>
            )}

            {/* loading */}
            {searchState === 'loading' && (
              <div className="flex items-center justify-center gap-2 py-6 text-[12px] text-[#A09890]">
                <Loader2 size={14} className="animate-spin" />
                <span>KIPRIS 조회 중... ({allClasses.length || 1}개 류)</span>
              </div>
            )}

            {/* error */}
            {searchState === 'error' && (
              <div className="space-y-3">
                <p className="text-[12px] text-red-400">조회 실패 — KIPRIS 서버에 연결할 수 없습니다.</p>
                <div className="flex gap-2">
                  <button onClick={handleSearch} className="flex-1 py-2 rounded-xl bg-[#7BAFD4]/20 text-[#7BAFD4] text-[12px] hover:bg-[#7BAFD4]/30 transition-colors">재시도</button>
                  <button onClick={() => setSearchState('idle')} className="flex-1 py-2 rounded-xl bg-[#4A4440] text-[#A09890] text-[12px] hover:bg-[#5A5450] transition-colors">취소</button>
                </div>
              </div>
            )}

            {/* done */}
            {searchState === 'done' && overallRisk && (
              <div className="space-y-3">
                <RiskGauge level={overallRisk} />

                {/* 류별 결과 */}
                <div className="space-y-2">
                  {classResults.map((cr) => (
                    <div key={cr.classCode} className="rounded-xl bg-[#2C2825] border border-[#4A4440] p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-semibold text-[#D0CAC2]">
                          {cr.classCode !== '-' ? `제${cr.classCode}류` : ''} {cr.label}
                        </span>
                        <div className="flex items-center gap-1">
                          {cr.result.totalCount === 0 && <><ShieldCheck size={11} className="text-emerald-400" /><span className="text-[10px] text-emerald-400">없음</span></>}
                          {cr.result.totalCount > 0 && cr.riskLevel !== 'BLOCKED' && <><ShieldAlert size={11} className="text-amber-400" /><span className="text-[10px] text-amber-400">{cr.result.totalCount}건</span></>}
                          {cr.riskLevel === 'BLOCKED' && <><ShieldX size={11} className="text-red-400" /><span className="text-[10px] text-red-400">{cr.result.totalCount}건</span></>}
                        </div>
                      </div>
                      {cr.result.items.length > 0 && (
                        <div className="space-y-1">
                          {cr.result.items.slice(0, 3).map((item: TrademarkItem, i: number) => (
                            <div key={i} className="flex items-center justify-between gap-2">
                              <p className="text-[11px] text-[#7A7570] truncate">{item.title}</p>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${item.status === '등록' ? 'bg-red-400/20 text-red-400' : 'bg-[#4A4440] text-[#6A6460]'}`}>
                                {item.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setSearchState('idle'); setClassResults([]); setOverallRisk(null); }}
                  className="w-full py-2 rounded-xl bg-[#4A4440] text-[#A09890] text-[12px] hover:bg-[#5A5450] transition-colors"
                >
                  다시 조회
                </button>
              </div>
            )}
          </div>

          {/* KIPRIS 직접 링크 */}
          <a
            href="https://www.kipris.or.kr/khome/main.do"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#2C2825] border border-[#4A4440] text-[12px] text-[#A09890] hover:text-[#D0CAC2] transition-colors"
          >
            <span>KIPRIS 홈페이지에서 직접 검색</span>
            <ExternalLink size={12} />
          </a>

          {/* 면책 */}
          <p className="text-[10px] text-[#6A6460] text-center leading-relaxed">
            참고용 정보만 제공하며 법적 효력이 없습니다.
            <br />상표 출원 전 반드시 전문 변리사와 상담하세요.
          </p>
        </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
