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

export type GithubTitleResult =
  | { title: string }
  | { error: "rate-limit" | "not-found" };

/**
 * 공개 GitHub API로 이슈·PR 제목을 가져온다.
 * 로그인 없는 요청은 IP당 1시간 60회 제한이 있어서(학교 와이파이처럼 같은 IP를 쓰면 금방 넘음)
 * 403·429는 "not-found"와 구분해 돌려준다.
 */
export async function fetchGithubTitle(
  parsed: ParsedGithubWork,
): Promise<GithubTitleResult> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues/${parsed.number}`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (res.status === 403 || res.status === 429) return { error: "rate-limit" };
    if (!res.ok) return { error: "not-found" };
    const data = (await res.json()) as { title?: string };
    return data.title ? { title: data.title } : { error: "not-found" };
  } catch {
    return { error: "not-found" };
  }
}
