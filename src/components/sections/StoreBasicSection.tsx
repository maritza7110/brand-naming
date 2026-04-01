import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { Dropdown } from '../ui/Dropdown';
import { TextArea } from '../ui/TextArea';
import { RecommendButton } from '../ui/RecommendButton';

const CATEGORY_OPTIONS = [
  '음식점/레스토랑', '카페/베이커리', '주점/바', '소매/마트',
  '패션/의류', '뷰티/미용', '건강/피트니스', '교육/학원',
  'IT/테크', '디자인/크리에이티브', '컨설팅/전문서비스',
  '숙박/펜션', '문화/엔터테인먼트', '기타',
];

const SCALE_OPTIONS = [
  '1인 창업', '소형 (5인 미만)', '중형 (5~20인)',
  '대형 (20인 이상)', '프랜차이즈',
];

const PRICE_RANGE_OPTIONS = [
  '저가', '중저가', '중가', '중고가', '고가', '프리미엄',
];

export function StoreBasicSection() {
  const storeBasic = useFormStore((s) => s.storeBasic);
  const updateStoreBasic = useFormStore((s) => s.updateStoreBasic);
  const { recommend, isLoading } = useRecommend();

  const hasInput = Object.values(storeBasic).some((v) => v.trim() !== '');

  return (
    <section className="rounded-2xl bg-white/80 backdrop-blur-sm p-7 shadow-sm shadow-indigo-500/5 ring-1 ring-indigo-100/50">
      <SectionHeader title="매장 기본" icon="🏪" />

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="업종"
            value={storeBasic.category}
            onChange={(v) => updateStoreBasic('category', v)}
            options={CATEGORY_OPTIONS}
            placeholder="선택"
          />
          <Dropdown
            label="규모"
            value={storeBasic.scale}
            onChange={(v) => updateStoreBasic('scale', v)}
            options={SCALE_OPTIONS}
            placeholder="선택"
          />
        </div>
        <TextArea
          label="주력 상품/서비스"
          value={storeBasic.mainProduct}
          onChange={(v) => updateStoreBasic('mainProduct', v)}
          placeholder="수제 드립커피, 시그니처 디저트, 브런치 메뉴"
          rows={2}
        />
        <Dropdown
          label="가격대"
          value={storeBasic.priceRange}
          onChange={(v) => updateStoreBasic('priceRange', v)}
          options={PRICE_RANGE_OPTIONS}
          placeholder="선택"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
