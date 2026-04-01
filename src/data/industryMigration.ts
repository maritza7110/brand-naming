import type { IndustrySelection } from '../types/form';

/**
 * 기존 v1.0 flat 카테고리 -> IndustrySelection 매핑 (D-11)
 *
 * 현재 form 필드는 persist되지 않으므로 이 매핑은 직접 사용되지 않지만,
 * 향후 form persist 추가 시 안전하게 마이그레이션할 수 있도록 준비한 안전장치.
 */
export const LEGACY_CATEGORY_MAPPING: Record<string, Partial<IndustrySelection>> = {
  '음식점/레스토랑': { major: '음식' },
  '카페/베이커리': { major: '음식', medium: '카페/디저트' },
  '주점/바': { major: '음식', medium: '유흥주점' },
  '소매/마트': { major: '소매' },
  '패션/의류': { major: '소매', medium: '의류' },
  '뷰티/미용': { major: '생활서비스', medium: '미용' },
  '건강/피트니스': { major: '관광/여가/오락', medium: '스포츠' },
  '교육/학원': { major: '학문/교육' },
  'IT/테크': { major: '기타', medium: 'IT/디자인' },
  '디자인/크리에이티브': { major: '기타', medium: 'IT/디자인' },
  '컨설팅/전문서비스': { major: '기타', medium: '컨설팅' },
  '숙박/펜션': { major: '숙박' },
  '문화/엔터테인먼트': { major: '관광/여가/오락' },
  '기타': { major: '기타' },
};
