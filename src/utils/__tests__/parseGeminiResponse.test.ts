import { describe, it, expect } from 'vitest';
import { parseSimpleResponse, parseDocBasedResponse } from '../parseGeminiResponse';

describe('parseSimpleResponse', () => {
  it('정상 JSON 배열을 파싱한다', () => {
    const raw = JSON.stringify([
      { brandName: '테스트', reasoning: '이유', validityScore: 85, namingTechnique: '조합', meaningAnalysis: '의미', reflectedInputs: ['업종'] },
    ]);
    const result = parseSimpleResponse(raw);
    expect(result).toHaveLength(1);
    expect(result[0].brandName).toBe('테스트');
    expect(result[0].validityScore).toBe(85);
  });

  it('빈 문자열이면 에러를 던진다', () => {
    expect(() => parseSimpleResponse('')).toThrow('AI 응답이 비어 있습니다.');
  });

  it('공백만 있는 문자열이면 에러를 던진다', () => {
    expect(() => parseSimpleResponse('   ')).toThrow('AI 응답이 비어 있습니다.');
  });

  it('배열 패턴이 없는 잘못된 JSON이면 에러를 던진다', () => {
    expect(() => parseSimpleResponse('not json at all')).toThrow('AI 응답을 파싱할 수 없습니다');
  });

  it('JSON 앞뒤에 쓰레기 텍스트가 있어도 배열 패턴을 추출한다', () => {
    const raw = 'Here is the result: [{"brandName":"추출됨","reasoning":"이유"}] end';
    const result = parseSimpleResponse(raw);
    expect(result).toHaveLength(1);
    expect(result[0].brandName).toBe('추출됨');
  });
});

describe('parseDocBasedResponse', () => {
  it('정상 JSON 객체를 파싱한다', () => {
    const raw = JSON.stringify({
      candidates: [{ brandName: '문서기반', reasoning: '이유', validityScore: 90, namingTechnique: '암시', meaningAnalysis: '분석', reflectedInputs: ['비전'], documentReference: '참고문헌', trademarkRiskLevel: '낮음', trademarkGrade: '조어상표', trademarkNote: '안전' }],
      consumerChecklist: ['체크1'],
      processNote: '프로세스',
    });
    const result = parseDocBasedResponse(raw);
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0].brandName).toBe('문서기반');
    expect(result.consumerChecklist).toContain('체크1');
  });

  it('빈 문자열이면 에러를 던진다', () => {
    expect(() => parseDocBasedResponse('')).toThrow('AI 응답이 비어 있습니다.');
  });

  it('객체 패턴이 없는 잘못된 JSON이면 에러를 던진다', () => {
    expect(() => parseDocBasedResponse('invalid')).toThrow('AI 응답을 파싱할 수 없습니다');
  });
});
