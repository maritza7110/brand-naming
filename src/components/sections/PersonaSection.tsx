import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { RecommendButton } from '../ui/RecommendButton';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';
import type { PersonaState } from '../../types/form';

const F: { key: keyof PersonaState; label: string; ph: string }[] = [
  { key: 'philosophy', label: '브랜드철학', ph: '좋은 원두, 정직한 한 잔' },
  { key: 'slogan', label: '슬로건', ph: '하루의 시작, 당신만의 한 잔' },
  { key: 'coreTechnology', label: '핵심기술', ph: '산지 직거래 로스팅' },
  { key: 'coreStrategy', label: '핵심전략', ph: '지역 밀착 커뮤니티 브랜딩' },
  { key: 'brandMent', label: '브랜드 멘트', ph: '커피 한 잔에 담긴 진심' },
  { key: 'customerDefinition', label: '고객정의', ph: '20~40대, 품질 좋은 커피를 원하는 고객' },
  { key: 'customerValue', label: '고객가치', ph: '일상 속 여유로운 커피 한 잔' },
  { key: 'customerCultureCreation', label: '고객문화창조', ph: '동네 사랑방 같은 커피 문화' },
  { key: 'competitiveAdvantage', label: '비교우위', ph: '핸드드립 전문, 아늑한 인테리어' },
  { key: 'qualityLevel', label: '품질수준', ph: '스페셜티 등급 원두' },
  { key: 'priceLevel', label: '가격수준', ph: '아메리카노 3,500원' },
  { key: 'functionalBenefit', label: '기능적혜택', ph: '출근길 빠른 픽업' },
  { key: 'experientialBenefit', label: '경험적혜택', ph: '아늑한 공간, 바리스타와의 대화' },
  { key: 'symbolicBenefit', label: '상징적혜택', ph: '감각적 라이프스타일' },
  { key: 'brandKeyword', label: '키워드', ph: '정직, 따뜻함, 장인정신' },
  { key: 'membershipPhilosophy', label: '멤버쉽 철학', ph: '단골에게 특별한 경험과 감사' },
];

export function PersonaSection() {
  const p = useFormStore((s) => s.persona);
  const u = useFormStore((s) => s.updatePersona);
  const { recommend, isLoading } = useRecommend();
  const hasInput = Object.values(p).some((v) => v.trim() !== '');

  return (
    <section className="rounded-2xl bg-[#3E3A36] p-7 border border-[#4A4640]">
      <SectionHeader title="브랜드 페르소나" />
      <div className="space-y-3">
        {F.map(({ key, label, ph }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-medium text-[#A09890]">{label}</label>
              <MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!p[key].trim()} />
            </div>
            <textarea value={p[key]} onChange={(e) => u(key, e.target.value)} placeholder={ph} rows={1}
              className="w-full px-4 py-2.5 rounded-xl bg-[#4A4640] text-[14px] text-[#F0EBE3] leading-relaxed placeholder:text-[#7A7570] border border-[#4A4640] resize-none transition-all duration-200 hover:border-[#504A44] focus:border-[#B48C50]/60 focus:bg-[#504A44] focus:outline-none" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
