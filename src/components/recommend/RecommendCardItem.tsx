import type { RecommendBatch } from '../../types/form';

interface Props {
  batch: RecommendBatch;
}

export function RecommendCardItem({ batch }: Props) {
  const time = batch.createdAt.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="rounded-lg bg-[#1A1A1A] border border-[#222] p-4">
      {batch.names.map((n, i) => (
        <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-[#222]' : ''}>
          <span className="text-[15px] font-bold text-[#D4A853]">
            {n.brandName}
          </span>
          <p className="mt-1 text-[12px] text-[#666] leading-relaxed">
            {n.reasoning}
          </p>
        </div>
      ))}

      <div className="mt-3 pt-2 border-t border-[#1F1F1F] flex items-center gap-1.5 flex-wrap">
        {batch.basedOn.slice(0, 4).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded bg-[#222] text-[10px] text-[#555]">
            {tag}
          </span>
        ))}
        {batch.basedOn.length > 4 && (
          <span className="text-[10px] text-[#444]">+{batch.basedOn.length - 4}</span>
        )}
        <span className="ml-auto text-[10px] text-[#333]">{time}</span>
      </div>
    </div>
  );
}
