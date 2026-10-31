import type { RelatedWorkType } from "../model/type";

export interface ParsedGithubWork {
  type: RelatedWorkType;
  number: number;
  owner: string;
  repo: string;
}

const GITHUB_ISSUE_OR_PR_URL =
  /^https?:\/\/github\.com\/([^/\s]+)\/([^/\s]+)\/(issues|pull)\/(\d+)/i;

/** GitHub 이슈·PR 링크를 파싱한다. 형식이 다르면 null을 반환한다. */
export function parseGithubUrl(input: string): ParsedGithubWork | null {
  const match = input.trim().match(GITHUB_ISSUE_OR_PR_URL);
  if (!match) return null;

  const [, owner, repo, kind, number] = match;
  return {
    type: kind === "pull" ? "PR" : "ISSUE",
    number: Number(number),
    owner,
    repo,
  };
}

/** 공개 GitHub API로 이슈·PR 제목을 가져온다. 실패하면 null을 반환한다. */
export async function fetchGithubTitle(
  parsed: ParsedGithubWork,
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues/${parsed.number}`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { title?: string };
    return data.title ?? null;
  } catch {
    return null;
  }
}
