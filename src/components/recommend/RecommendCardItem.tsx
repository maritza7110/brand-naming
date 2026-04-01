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
    <div className="rounded-lg bg-white border border-gray-200/60 p-4 shadow-sm">
      {batch.names.map((n, i) => (
        <div key={i} className={i > 0 ? 'mt-2.5 pt-2.5 border-t border-gray-100' : ''}>
          <span className="text-[15px] font-bold text-gray-900">
            {n.brandName}
          </span>
          <p className="mt-0.5 text-[12px] text-gray-400 leading-relaxed">
            {n.reasoning}
          </p>
        </div>
      ))}

      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        {batch.basedOn.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 rounded bg-gray-100/80 text-[10px] text-gray-400"
          >
            {tag}
          </span>
        ))}
        {batch.basedOn.length > 4 && (
          <span className="text-[10px] text-gray-300">
            +{batch.basedOn.length - 4}
          </span>
        )}
        <span className="ml-auto text-[10px] text-gray-300">{time}</span>
      </div>
    </div>
  );
}
