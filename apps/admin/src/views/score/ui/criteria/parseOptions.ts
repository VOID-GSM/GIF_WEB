// 서버(ScoreOptionRules)와 같은 규칙: 1~10개, 각 0~1000, 중복 불가, 하나 이상은 1점 이상
export const MAX_OPTIONS = 10;
export const MAX_OPTION_SCORE = 1000;

export type ParseOptionsResult =
  | { ok: true; options: number[] }
  | { ok: false; error: string };

// "40, 32, 24" 같은 입력을 높은 점수 순 배열로 바꾼다.
export function parseOptions(input: string): ParseOptionsResult {
  const tokens = input.split(/[\s,]+/).filter(Boolean);
  if (tokens.length === 0) return { ok: false, error: "선택지 점수를 1개 이상 입력해주세요." };
  if (tokens.length > MAX_OPTIONS) {
    return { ok: false, error: `선택지 점수는 ${MAX_OPTIONS}개 이하여야 합니다.` };
  }

  const options: number[] = [];
  for (const token of tokens) {
    if (!/^\d+$/.test(token)) return { ok: false, error: "선택지 점수는 0 이상의 정수만 입력할 수 있습니다." };
    const value = Number(token);
    if (value > MAX_OPTION_SCORE) {
      return { ok: false, error: `선택지 점수는 ${MAX_OPTION_SCORE} 이하여야 합니다.` };
    }
    if (options.includes(value)) return { ok: false, error: `${value}점이 중복되었습니다.` };
    options.push(value);
  }

  if (options.every((v) => v === 0)) {
    return { ok: false, error: "선택지 중 하나 이상은 1점 이상이어야 합니다." };
  }

  return { ok: true, options: options.sort((a, b) => b - a) };
}
