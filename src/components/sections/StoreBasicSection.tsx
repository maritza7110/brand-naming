import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { Dropdown } from '../ui/Dropdown';
import { TextArea } from '../ui/TextArea';
import { RecommendButton } from '../ui/RecommendButton';

const CATEGORY_OPTIONS = ['음식점/레스토랑','카페/베이커리','주점/바','소매/마트','패션/의류','뷰티/미용','건강/피트니스','교육/학원','IT/테크','디자인/크리에이티브','컨설팅/전문서비스','숙박/펜션','문화/엔터테인먼트','기타'];
const SCALE_OPTIONS = ['1인 창업','소형 (5인 미만)','중형 (5~20인)','대형 (20인 이상)','프랜차이즈'];
const PRICE_RANGE_OPTIONS = ['저가','중저가','중가','중고가','고가','프리미엄'];

export function StoreBasicSection() {
  const s = useFormStore((st) => st.storeBasic);
  const u = useFormStore((st) => st.updateStoreBasic);
  const { recommend, isLoading } = useRecommend();
  const hasInput = Object.values(s).some((v) => v.trim() !== '');

  return (
    <section className="rounded-2xl bg-[#332F2C] p-7 border border-[#3E3A36]">
      <SectionHeader title="매장 기본" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Dropdown label="업종" value={s.category} onChange={(v) => u('category', v)} options={CATEGORY_OPTIONS} />
          <Dropdown label="규모" value={s.scale} onChange={(v) => u('scale', v)} options={SCALE_OPTIONS} />
        </div>
        <TextArea label="주력 상품/서비스" value={s.mainProduct} onChange={(v) => u('mainProduct', v)} placeholder="수제 드립커피, 시그니처 디저트" rows={2} />
        <Dropdown label="가격대" value={s.priceRange} onChange={(v) => u('priceRange', v)} options={PRICE_RANGE_OPTIONS} />
      </div>
      <div className="mt-6 flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
