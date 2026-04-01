import type { RecommendBatch } from '../../types/form';

interface Props { batch: RecommendBatch; }

export function RecommendCardItem({ batch }: Props) {
  const time = batch.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="rounded-xl bg-[#2C2825] border border-[#4A4440] p-4">
      {batch.names.map((n, i) => (
        <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-[#4A4440]' : ''}>
          <span className="text-[15px] font-bold text-[#B48C50]">{n.brandName}</span>
          <p className="mt-1 text-[12px] text-[#A09890] leading-relaxed">{n.reasoning}</p>
        </div>
      ))}
      <div className="mt-3 pt-2 border-t border-[#332F2C] flex items-center gap-1.5 flex-wrap">
        {batch.basedOn.slice(0, 4).map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full bg-[#4A4440] text-[10px] text-[#A09890]">{t}</span>
        ))}
        {batch.basedOn.length > 4 && <span className="text-[10px] text-[#A09890]">+{batch.basedOn.length - 4}</span>}
        <span className="ml-auto text-[10px] text-[#7A7570]">{time}</span>
      </div>
    </div>
  );
}
