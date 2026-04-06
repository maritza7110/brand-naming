import { useState } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Loader2 } from 'lucide-react';
import { searchTrademark } from '../../services/kiprisService';
import type { TrademarkResult } from '../../services/kiprisService';

interface Props {
  brandName: string;
}

type State = 'idle' | 'loading' | TrademarkResult | 'error';

function getRisk(result: TrademarkResult): 'safe' | 'caution' | 'danger' {
  if (result.totalCount === 0) return 'safe';
  const registered = result.items.some((i) => i.status === '등록');
  return registered ? 'danger' : 'caution';
}

export function TrademarkBadge({ brandName }: Props) {
  const [state, setState] = useState<State>('idle');

  const handleCheck = async () => {
    if (state === 'loading') return;
    setState('loading');
    try {
      const result = await searchTrademark(brandName);
      setState(result);
    } catch {
      setState('error');
    }
  };

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={handleCheck}
        className="inline-flex items-center gap-1 text-[11px] text-[#A09890] hover:text-[#B48C50] transition-colors"
      >
        <ShieldCheck size={11} />
        <span>상표 확인</span>
      </button>
    );
  }

  if (state === 'loading') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-[#A09890]">
        <Loader2 size={11} className="animate-spin" />
        <span>조회 중...</span>
      </span>
    );
  }

  if (state === 'error') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-red-400 cursor-pointer" onClick={handleCheck}>
        <ShieldX size={11} />
        <span>재시도</span>
      </span>
    );
  }

  const risk = getRisk(state);

  return (
    <div className="mt-1.5">
      {risk === 'safe' && (
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
          <ShieldCheck size={11} />
          <span>동일 상표 없음</span>
        </span>
      )}
      {risk === 'caution' && (
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
            <ShieldAlert size={11} />
            <span>유사 출원 {state.totalCount}건</span>
          </span>
          {state.items.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {state.items.slice(0, 3).map((item, i) => (
                <li key={i} className="text-[10px] text-[#7A7570]">
                  {item.title} · {item.status} · {item.applicant}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {risk === 'danger' && (
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] text-red-400">
            <ShieldX size={11} />
            <span>등록 상표 존재 ({state.totalCount}건)</span>
          </span>
          {state.items.length > 0 && (
            <ul className="mt-1 space-y-0.5">
              {state.items.slice(0, 3).map((item, i) => (
                <li key={i} className="text-[10px] text-[#7A7570]">
                  {item.title} · {item.status} · {item.applicant}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
