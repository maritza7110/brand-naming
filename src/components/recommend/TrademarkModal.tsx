import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, ShieldAlert, ShieldX, Loader2, ExternalLink } from 'lucide-react';
import { searchTrademark } from '../../services/kiprisService';
import type { TrademarkResult } from '../../services/kiprisService';

import { useFormStore } from '../../store/useFormStore';

interface Props { open: boolean; onClose: () => void; brandName: string; }

// ─── 업종 → 니스 상품류 코드 매핑 ──────────────────────────────────────────
const NICE_CLASS_MAP: Record<string, string> = {
  // 식음료
  '카페': '43', '커피': '43', '음식점': '43', '한식': '43', '치킨': '43',
  '피자': '43', '베이커리': '43', '빵': '43', '술집': '43', '식당': '43',
  '분식': '43', '일식': '43', '중식': '43', '양식': '43',
  // 뷰티·미용
  '뷰티': '03', '화장품': '03', '네일': '44', '헤어': '44', '미용': '44',
  // 의류·패션
  '의류': '25', '패션': '25', '신발': '25', '가방': '18',
  // IT·소프트웨어
  'IT': '09', '소프트웨어': '09', '앱': '09', '플랫폼': '42',
  // 교육
  '교육': '41', '학원': '41', '온라인교육': '41',
  // 피트니스·건강
  '피트니스': '41', '헬스': '41', '요가': '41', '필라테스': '41',
  // 의료
  '의료': '44', '병원': '44', '한의원': '44', '약국': '05',
  // 반려동물
  '반려동물': '31', '펫': '31',
  // 세탁·청소
  '세탁': '37', '청소': '37',
  // 물류·운송
  '물류': '39', '배송': '39', '운송': '39',
  // 부동산·건설
  '부동산': '36', '건설': '37', '인테리어': '42',
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

export function TrademarkModal({ open, onClose, brandName }: Props) {
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [result, setResult] = useState<TrademarkResult | null>(null);
  const [riskLevel, setRiskLevel] = useState<RiskLevel | null>(null);

  if (!open) return null;

  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };

  document.body.style.overflow = 'hidden';

  // 업종에서 니스 분류 코드 조회
  function getNiceClass(): string | undefined {
    const { industry } = useFormStore.getState().storeBasic;
    const terms = [industry.minor, industry.medium, industry.major].filter(Boolean);
    for (const term of terms) {
      if (NICE_CLASS_MAP[term]) return NICE_CLASS_MAP[term];
      for (const [key, code] of Object.entries(NICE_CLASS_MAP)) {
        if (term.includes(key) || key.includes(term)) return code;
      }
    }
    return undefined;
  }

  const niceClass = getNiceClass();

  async function handleSearch() {
    setSearchState('loading');
    try {
      const data = await searchTrademark(brandName, niceClass);
      setResult(data);
      setRiskLevel(calcRiskLevel(data));
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
                  <p className="text-[11px] text-amber-400 font-semibold mb-1">주의사항</p>
                  <ul className="text-[11px] text-[#A09890] space-y-0.5 list-disc list-inside">
                    <li>조회 상품류: {niceClass ? `제${niceClass}류` : '전체 (업종 미선택)'}</li>
                    <li>동일 상표명만 조회 (유사 상표 별도)</li>
                    <li>법적 효력 없음</li>
                  </ul>
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full py-2.5 rounded-xl bg-[#7BAFD4]/20 text-[#7BAFD4] text-[13px] font-semibold hover:bg-[#7BAFD4]/30 transition-colors"
                >
                  KIPRIS 실사 조회
                </button>
              </div>
            )}

            {/* loading */}
            {searchState === 'loading' && (
              <div className="flex items-center justify-center gap-2 py-6 text-[12px] text-[#A09890]">
                <Loader2 size={14} className="animate-spin" />
                <span>KIPRIS 조회 중...</span>
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
            {searchState === 'done' && result && riskLevel && (
              <div className="space-y-3">
                <RiskGauge level={riskLevel} />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {result.totalCount === 0 && <><ShieldCheck size={13} className="text-emerald-400" /><span className="text-[12px] text-emerald-400 font-semibold">동일 상표 없음</span></>}
                    {result.totalCount > 0 && riskLevel !== 'BLOCKED' && <><ShieldAlert size={13} className="text-amber-400" /><span className="text-[12px] text-amber-400 font-semibold">유사 출원 {result.totalCount}건</span></>}
                    {riskLevel === 'BLOCKED' && <><ShieldX size={13} className="text-red-400" /><span className="text-[12px] text-red-400 font-semibold">등록 상표 {result.totalCount}건</span></>}
                  </div>

                  {result.items.length > 0 && (
                    <div className="rounded-xl bg-[#2C2825] border border-[#4A4440] divide-y divide-[#4A4440] overflow-hidden">
                      {result.items.slice(0, 5).map((item, i) => (
                        <div key={i} className="px-3 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[12px] font-medium text-[#D0CAC2] truncate">{item.title}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${item.status === '등록' ? 'bg-red-400/20 text-red-400' : 'bg-[#4A4440] text-[#A09890]'}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#6A6460] mt-0.5">{item.applicant} · {item.applicationDate}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => { setSearchState('idle'); setResult(null); setRiskLevel(null); }}
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
