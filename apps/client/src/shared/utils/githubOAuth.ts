const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";

export const GITHUB_OAUTH_STATE_KEY = "github_oauth_state";
export const GITHUB_CALLBACK_PATH = "/assessment/github/callback";

export const getGithubRedirectUri = () =>
  `${window.location.origin}${GITHUB_CALLBACK_PATH}`;

// GitHub 인가 페이지로 이동한다. client id 가 없으면 false 를 돌려준다.
export function redirectToGithubAuthorize(): boolean {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  if (!clientId) return false;

  const state = crypto.randomUUID();
  sessionStorage.setItem(GITHUB_OAUTH_STATE_KEY, state);

  const query = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGithubRedirectUri(),
    scope: "read:user",
    state,
  });
  window.location.href = `${GITHUB_AUTHORIZE_URL}?${query}`;
  return true;
}
