import type { RecommendBatch } from '../../types/form';

interface Props { batch: RecommendBatch; }

export function RecommendCardItem({ batch }: Props) {
  const time = batch.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="rounded-xl bg-[#FDFCFA] border border-[#EAE6E0] p-4">
      {batch.names.map((n, i) => (
        <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-[#EAE6E0]' : ''}>
          <span className="text-[15px] font-bold text-[#2C2825]">{n.brandName}</span>
          <p className="mt-1 text-[12px] text-[#8A8580] leading-relaxed">{n.reasoning}</p>
        </div>
      ))}
      <div className="mt-3 pt-2 border-t border-[#F0ECE6] flex items-center gap-1.5 flex-wrap">
        {batch.basedOn.slice(0, 4).map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full bg-[#F0ECE6] text-[10px] font-medium text-[#8A8580]">{t}</span>
        ))}
        {batch.basedOn.length > 4 && <span className="text-[10px] text-[#B5AFA8]">+{batch.basedOn.length - 4}</span>}
        <span className="ml-auto text-[10px] text-[#C5C0BA]">{time}</span>
      </div>
    </div>
  );
}
