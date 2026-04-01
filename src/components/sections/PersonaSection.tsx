import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { RecommendButton } from '../ui/RecommendButton';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';
import type { PersonaState } from '../../types/form';

const personaFields: { key: keyof PersonaState; label: string; placeholder: string }[] = [
  { key: 'philosophy', label: '브랜드철학', placeholder: '좋은 원두, 정직한 한 잔' },
  { key: 'slogan', label: '슬로건', placeholder: '하루의 시작, 당신만의 한 잔' },
  { key: 'coreTechnology', label: '핵심기술', placeholder: '산지 직거래 로스팅' },
  { key: 'coreStrategy', label: '핵심전략', placeholder: '지역 밀착 커뮤니티 브랜딩' },
  { key: 'brandMent', label: '브랜드 멘트', placeholder: '커피 한 잔에 담긴 진심' },
  { key: 'customerDefinition', label: '고객정의', placeholder: '20~40대, 품질 좋은 커피를 원하는 고객' },
  { key: 'customerValue', label: '고객가치', placeholder: '일상 속 여유로운 커피 한 잔' },
  { key: 'customerCultureCreation', label: '고객문화창조', placeholder: '동네 사랑방 같은 커피 문화' },
  { key: 'competitiveAdvantage', label: '비교우위', placeholder: '핸드드립 전문, 아늑한 인테리어' },
  { key: 'qualityLevel', label: '품질수준', placeholder: '스페셜티 등급 원두' },
  { key: 'priceLevel', label: '가격수준', placeholder: '아메리카노 3,500원' },
  { key: 'functionalBenefit', label: '기능적혜택', placeholder: '출근길 빠른 픽업' },
  { key: 'experientialBenefit', label: '경험적혜택', placeholder: '아늑한 공간, 바리스타와의 대화' },
  { key: 'symbolicBenefit', label: '상징적혜택', placeholder: '감각적 라이프스타일' },
  { key: 'brandKeyword', label: '키워드', placeholder: '정직, 따뜻함, 장인정신' },
  { key: 'membershipPhilosophy', label: '멤버쉽 철학', placeholder: '단골에게 특별한 경험과 감사' },
];

export function PersonaSection() {
  const persona = useFormStore((s) => s.persona);
  const updatePersona = useFormStore((s) => s.updatePersona);
  const { recommend, isLoading } = useRecommend();

  const hasInput = Object.values(persona).some((v) => v.trim() !== '');

  return (
    <section className="rounded-2xl bg-white/80 backdrop-blur-sm p-7 shadow-sm shadow-indigo-500/5 ring-1 ring-indigo-100/50">
      <SectionHeader title="브랜드 페르소나" icon="✨" />

      <div className="space-y-3">
        {personaFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-semibold text-indigo-400/80 uppercase tracking-[0.05em]">
                {label}
              </label>
              <MiniRecommendButton disabled={!persona[key].trim()} />
            </div>
            <textarea
              value={persona[key]}
              onChange={(e) => updatePersona(key, e.target.value)}
              placeholder={placeholder}
              rows={1}
              className="w-full px-4 py-2.5 rounded-xl border-0 bg-indigo-50/40 text-[14px] leading-relaxed placeholder:text-gray-300 resize-none transition-all duration-300 ring-1 ring-indigo-100 hover:ring-indigo-200 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:shadow-lg focus:shadow-indigo-500/10 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
