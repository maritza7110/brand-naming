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
    <div className="rounded-xl bg-white p-4 shadow-sm shadow-indigo-500/5 ring-1 ring-indigo-100/40">
      {batch.names.map((n, i) => (
        <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-indigo-50' : ''}>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <span className="text-[15px] font-bold text-gray-900">
              {n.brandName}
            </span>
          </div>
          <p className="mt-1 ml-7 text-[12px] text-gray-500 leading-relaxed">
            {n.reasoning}
          </p>
        </div>
      ))}

      <div className="mt-3 pt-2 border-t border-indigo-50/60 flex items-center gap-1.5 flex-wrap">
        {batch.basedOn.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full bg-indigo-50 text-[10px] font-medium text-indigo-400"
          >
            {tag}
          </span>
        ))}
        {batch.basedOn.length > 4 && (
          <span className="text-[10px] text-indigo-300">+{batch.basedOn.length - 4}</span>
        )}
        <span className="ml-auto text-[10px] text-gray-300">{time}</span>
      </div>
    </div>
  );
}
