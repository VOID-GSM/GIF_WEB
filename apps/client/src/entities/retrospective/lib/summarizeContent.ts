// TODO(backend): AI 요약 API가 생기면 이 파일은 삭제하고 서버 응답을 그대로 쓴다.
// 그 전까지는 본문에서 의미 있어 보이는 줄을 앞에서부터 몇 개 뽑아 보여주는 임시 로직이다.

function stripMarkdown(line: string) {
  return line
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/^>\s?/, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/<u>(.+?)<\/u>/g, "$1")
    .trim();
}

/** 본문 상위 몇 줄을 뽑아 "AI 요약"처럼 보여줄 임시 bullet 목록을 만든다 */
export function summarizeContent(content: string, maxBullets = 3): string[] {
  const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, " ");

  const lines = withoutCodeBlocks
    .split("\n")
    .map(stripMarkdown)
    .filter((line) => line.length > 4);

  const bullets: string[] = [];
  for (const line of lines) {
    if (bullets.length >= maxBullets) break;
    if (bullets.includes(line)) continue;
    bullets.push(line.length > 70 ? `${line.slice(0, 70)}…` : line);
  }

  return bullets;
}
