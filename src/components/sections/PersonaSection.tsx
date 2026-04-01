import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { RecommendButton } from '../ui/RecommendButton';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';
import type { PersonaState } from '../../types/form';

const personaFields: { key: keyof PersonaState; label: string; placeholder: string }[] = [
  { key: 'philosophy', label: '브랜드철학', placeholder: '예: 좋은 원두, 정직한 한 잔으로 일상의 가치를 높인다' },
  { key: 'slogan', label: '슬로건', placeholder: '예: 하루의 시작, 당신만의 한 잔' },
  { key: 'coreTechnology', label: '핵심기술', placeholder: '예: 산지 직거래 로스팅, 핸드드립 추출 기술' },
  { key: 'coreStrategy', label: '핵심전략', placeholder: '예: 지역 밀착 커뮤니티 기반 브랜딩' },
  { key: 'brandMent', label: '브랜드 멘트', placeholder: '예: 커피 한 잔에 담긴 진심, 매일 새롭게' },
  { key: 'customerDefinition', label: '고객정의(타겟)', placeholder: '예: 20~40대 직장인, 품질 좋은 커피를 합리적 가격에 원하는 고객' },
  { key: 'customerValue', label: '고객가치', placeholder: '예: 바쁜 일상 속 여유로운 커피 한 잔의 행복' },
  { key: 'customerCultureCreation', label: '고객문화창조', placeholder: '예: 동네 사랑방 같은 커피 문화 확산' },
  { key: 'competitiveAdvantage', label: '브랜드 비교 우위 속성', placeholder: '예: 산지 직거래 원두, 핸드드립 전문, 아늑한 한옥 인테리어' },
  { key: 'qualityLevel', label: '품질수준', placeholder: '예: 스페셜티 등급 원두, 바리스타 자격증 보유 직원' },
  { key: 'priceLevel', label: '가격수준', placeholder: '예: 아메리카노 3,500원 — 합리적 프리미엄' },
  { key: 'functionalBenefit', label: '고통을 해결하는 기능적혜택', placeholder: '예: 출근길 빠른 픽업, 안정적인 맛 품질' },
  { key: 'experientialBenefit', label: '경험적혜택', placeholder: '예: 아늑한 공간에서의 휴식, 바리스타와의 대화' },
  { key: 'symbolicBenefit', label: '상징적혜택', placeholder: '예: 감각적인 라이프스타일, 나만 아는 동네 카페' },
  { key: 'brandKeyword', label: '브랜드 키워드', placeholder: '예: 정직, 따뜻함, 장인정신, 커뮤니티' },
  { key: 'membershipPhilosophy', label: '고객 관리(멤버쉽) 철학', placeholder: '예: 단골 고객에게 특별한 경험과 감사를 전하는 멤버십' },
];

export function PersonaSection() {
  const persona = useFormStore((s) => s.persona);
  const updatePersona = useFormStore((s) => s.updatePersona);
  const { recommend, isLoading } = useRecommend();

  const hasInput = Object.values(persona).some((v) => v.trim() !== '');

  return (
    <section className="py-12">
      <SectionHeader title="브랜드 페르소나" />

      <div className="mt-6 space-y-6">
        {personaFields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[14px] font-medium text-gray-900">
                {label}
              </label>
              <MiniRecommendButton
                disabled={!persona[key].trim()}
              />
            </div>
            <textarea
              value={persona[key]}
              onChange={(e) => updatePersona(key, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-[15px] leading-relaxed placeholder:text-gray-400 resize-none transition-all duration-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
