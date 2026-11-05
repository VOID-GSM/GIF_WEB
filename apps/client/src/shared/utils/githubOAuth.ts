const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";

export const GITHUB_OAUTH_STATE_KEY = "github_oauth_state";
export const GITHUB_CALLBACK_PATH = "/assessment/github/callback";

export const getGithubRedirectUri = () =>
  `${window.location.origin}${GITHUB_CALLBACK_PATH}`;

// crypto.randomUUID 는 secure context(https·localhost)에서만 있으므로
// 어디서나 동작하는 getRandomValues 로 state 를 만든다.
const createOAuthState = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");

// GitHub 인가 페이지로 이동한다. client id 가 없으면 false 를 돌려준다.
export function redirectToGithubAuthorize(): boolean {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  if (!clientId) return false;

  const state = createOAuthState();
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
