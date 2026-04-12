/**
 * WorkshopBuilder Component
 * 심층 기획 워크숍 메인 컨테이너
 */
import { useEffect } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { PERSONA_FIELD_METADATA } from '../../types/workshop';
import { WorkshopProgress } from '../workshop/WorkshopProgress';
import { WorkshopField } from '../workshop/WorkshopField';
import { generatePlanningGuides } from '../../services/workshopService';

export function WorkshopBuilder() {
  const storeBasic = useFormStore((s) => s.storeBasic);
  const guides = useFormStore((s) => s.guides);
  const setFieldGuide = useFormStore((s) => s.setFieldGuide);
  const setExpandedField = useFormStore((s) => s.setExpandedField);

  // Initialize guides on mount
  useEffect(() => {
    const loadGuides = async () => {
      if (!storeBasic.industry.minor && !storeBasic.mainProduct) return;
      
      // Check if guides already loaded
      if (Object.keys(guides).length > 0 && guides[PERSONA_FIELD_METADATA[0].key]?.length > 0) {
        return;
      }

      try {
        const newGuides = await generatePlanningGuides(
          storeBasic.mainProduct || '브랜드',
          storeBasic.industry
        );
        
        Object.entries(newGuides).forEach(([key, guideList]) => {
          setFieldGuide(key as keyof typeof guides, guideList);
        });
        
        // Open first field
        setExpandedField(PERSONA_FIELD_METADATA[0].key);
      } catch (e) {
        console.error('가이드 생성 실패:', e);
      }
    };

    loadGuides();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto pb-24">
      <WorkshopProgress />
      
      <div className="space-y-4">
        {PERSONA_FIELD_METADATA.map(field => (
          <WorkshopField key={field.key} fieldKey={field.key} />
        ))}
      </div>
    </div>
  );
}
