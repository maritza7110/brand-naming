import { useFormStore } from '../../store/useFormStore';
import { getMajorCategories, getMediumCategories, getMinorCategories } from '../../data/industryData';
import { SectionHeader } from '../ui/SectionHeader';
import { Dropdown } from '../ui/Dropdown';
import { TextField } from '../ui/TextField';

const SCALE_OPTIONS = ['1인 창업','소형 (5인 미만)','중형 (5~20인)','대형 (20인 이상)','프랜차이즈'];
const PRICE_RANGE_OPTIONS = ['저가','중저가','중가','중고가','고가','프리미엄'];

export function StoreBasicSection() {
  const s = useFormStore((st) => st.storeBasic);
  const updateField = useFormStore((st) => st.updateStoreBasic);
  const industry = useFormStore((st) => st.storeBasic.industry);
  const updateIndustry = useFormStore((st) => st.updateIndustry);

  // 계층형 옵션 계산
  const majorOptions = getMajorCategories();
  const mediumOptions = industry.major ? getMediumCategories(industry.major) : [];
  const minorOptions = industry.major && industry.medium
    ? getMinorCategories(industry.major, industry.medium) : [];

  // Cascading reset 핸들러 (D-06)
  function handleMajorChange(major: string) {
    updateIndustry({ major, medium: '', minor: '', note: '' });
  }
  function handleMediumChange(medium: string) {
    updateIndustry({ ...industry, medium, minor: '', note: '' });
  }
  function handleMinorChange(minor: string) {
    updateIndustry({ ...industry, minor });
  }
  function handleNoteChange(note: string) {
    updateIndustry({ ...industry, note });
  }

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="매장 기본" />
      <div className="space-y-4">
        {/* 업종 선택 -- 2x2 grid (D-04) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Dropdown label="대분류" value={industry.major}
            onChange={handleMajorChange} options={majorOptions} />
          <Dropdown label="중분류" value={industry.medium}
            onChange={handleMediumChange} options={mediumOptions}
            disabled={!industry.major} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Dropdown label="소분류" value={industry.minor}
            onChange={handleMinorChange} options={minorOptions}
            disabled={!industry.medium} />
          <TextField label="비고" value={industry.note}
            onChange={handleNoteChange}
            placeholder="예: 떡볶이 전문, 고양이카페"
            disabled={!industry.minor} />
        </div>
        {/* 나머지 필드 -- 기존 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Dropdown label="규모" value={s.scale}
            onChange={(v) => updateField('scale', v)} options={SCALE_OPTIONS} />
          <Dropdown label="가격대" value={s.priceRange}
            onChange={(v) => updateField('priceRange', v)} options={PRICE_RANGE_OPTIONS} />
        </div>
        <TextField label="주력 상품/서비스" value={s.mainProduct}
          onChange={(v) => updateField('mainProduct', v)}
          placeholder="수제 드립커피, 시그니처 디저트" />
      </div>
    </section>
  );
}
