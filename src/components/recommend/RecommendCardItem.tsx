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
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
      {/* 브랜드명 + 사유 */}
      {batch.names.map((n, i) => (
        <div key={i} className="flex items-baseline gap-2">
          <span className="text-[17px] font-bold text-gray-900 whitespace-nowrap">
            {n.brandName}
          </span>
          <span className="text-[13px] text-gray-500 leading-snug">
            — {n.reasoning}
          </span>
        </div>
      ))}

      {/* 작명근거 태그 + 시간 */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-wrap gap-1">
          {batch.basedOn.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded bg-gray-100 text-[11px] text-gray-500"
            >
              {tag}
            </span>
          ))}
          {batch.basedOn.length > 5 && (
            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[11px] text-gray-500">
              +{batch.basedOn.length - 5}
            </span>
          )}
        </div>
        <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
          {time}
        </span>
      </div>
    </div>
  );
}
