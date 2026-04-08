import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ChipSelector } from '../ui/ChipSelector';
import { TextField } from '../ui/TextField';
import { useGalleryStore } from '../../store/useGalleryStore';
import { INDUSTRY_DATA } from '../../data/industryData';

const MAJOR_CATEGORIES = [...new Set(INDUSTRY_DATA.map((d) => d.major))];

const NAMING_STYLE_OPTIONS = [
  '합성어',
  '추상어',
  '은유/상징',
  '두문자',
  '의성어/의태어',
  '외래어 차용',
  '한글 순수',
  '숫자 조합',
];

export default function GalleryFilterBar() {
  const { filters, setFilters, resetFilters } = useGalleryStore();
  const [localKeyword, setLocalKeyword] = useState(filters.keyword);

  // 300ms debounce로 키워드 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localKeyword !== filters.keyword) {
        setFilters({ keyword: localKeyword });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localKeyword]);

  const hasActiveFilters = !!(filters.industry || filters.namingStyle || filters.keyword);

  function handleReset() {
    resetFilters();
    setLocalKeyword('');
  }

  return (
    <div className="py-4 border-b border-[var(--color-border)] space-y-4">
      <div className="flex items-center justify-between">
        <ChipSelector
          label="업종"
          options={MAJOR_CATEGORIES}
          selected={filters.industry ? [filters.industry] : []}
          onChange={(sel) => setFilters({ industry: sel[0] || null })}
          maxSelection={1}
        />
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-[14px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors duration-150 shrink-0 ml-4"
          >
            필터 초기화
          </button>
        )}
      </div>

      <ChipSelector
        label="네이밍 스타일"
        options={NAMING_STYLE_OPTIONS}
        selected={filters.namingStyle ? [filters.namingStyle] : []}
        onChange={(sel) => setFilters({ namingStyle: sel[0] || null })}
        maxSelection={1}
      />

      <TextField
        label="키워드 검색"
        value={localKeyword}
        onChange={setLocalKeyword}
        placeholder="브랜드명 또는 키워드 검색"
        labelAction={<Search size={16} className="text-[#5A5550]" />}
      />
    </div>
  );
}
