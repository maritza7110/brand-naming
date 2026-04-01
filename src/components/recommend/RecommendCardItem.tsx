import type { RecommendBatch } from '../../types/form';

interface Props { batch: RecommendBatch; }

export function RecommendCardItem({ batch }: Props) {
  const time = batch.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="rounded-xl bg-[#2C2825] border border-[#3A3632] p-4">
      {batch.names.map((n, i) => (
        <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-[#3A3632]' : ''}>
          <span className="text-[15px] font-bold text-[#B48C50]">{n.brandName}</span>
          <p className="mt-1 text-[12px] text-[#8A8178] leading-relaxed">{n.reasoning}</p>
        </div>
      ))}
      <div className="mt-3 pt-2 border-t border-[#332F2C] flex items-center gap-1.5 flex-wrap">
        {batch.basedOn.slice(0, 4).map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full bg-[#3A3632] text-[10px] text-[#8A8178]">{t}</span>
        ))}
        {batch.basedOn.length > 4 && <span className="text-[10px] text-[#6A6158]">+{batch.basedOn.length - 4}</span>}
        <span className="ml-auto text-[10px] text-[#5A5550]">{time}</span>
      </div>
    </div>
  );
}
