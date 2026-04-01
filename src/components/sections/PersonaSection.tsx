import { useFormStore } from '../../store/useFormStore';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { RecommendButton } from '../ui/RecommendButton';

export function PersonaSection() {
  const persona = useFormStore((s) => s.persona);
  const updatePersona = useFormStore((s) => s.updatePersona);

  const hasInput = Object.values(persona).some((v) => v.trim() !== '');

  return (
    <section className="py-12">
      <SectionHeader title="브랜드 페르소나" />

      <div className="mt-6 space-y-6">
        <TextArea
          label="브랜드 철학"
          value={persona.philosophy}
          onChange={(v) => updatePersona('philosophy', v)}
          placeholder="예: 좋은 원두, 정직한 한 잔"
          rows={3}
        />
        <TextArea
          label="슬로건"
          value={persona.slogan}
          onChange={(v) => updatePersona('slogan', v)}
          placeholder="예: 하루의 시작, 당신만의 한 잔"
          rows={3}
        />
        <TextArea
          label="미션"
          value={persona.mission}
          onChange={(v) => updatePersona('mission', v)}
          placeholder="예: 누구나 부담 없이 좋은 커피를 즐길 수 있는 공간"
          rows={3}
        />
        <TextArea
          label="브랜드 스토리"
          value={persona.brandStory}
          onChange={(v) => updatePersona('brandStory', v)}
          placeholder="예: 강릉 할머니댁 뒷마당에서 커피 나무를 키우던 기억에서 시작했습니다"
          rows={4}
        />
        <TextArea
          label="핵심 가치"
          value={persona.coreValues}
          onChange={(v) => updatePersona('coreValues', v)}
          placeholder="예: 진정성, 품질, 따뜻한 환대"
          rows={3}
        />
        <TextArea
          label="차별화 포인트"
          value={persona.differentiation}
          onChange={(v) => updatePersona('differentiation', v)}
          placeholder="예: 산지 직거래 원두, 핸드드립 전문, 아늑한 한옥 인테리어"
          rows={3}
        />
        <TextArea
          label="브랜드 톤앤매너"
          value={persona.toneAndManner}
          onChange={(v) => updatePersona('toneAndManner', v)}
          placeholder="예: 따뜻하고 친근하지만 세련된, 정갈한 톤"
          rows={3}
        />
      </div>

      <div className="mt-8">
        <RecommendButton disabled={!hasInput} />
      </div>
    </section>
  );
}
