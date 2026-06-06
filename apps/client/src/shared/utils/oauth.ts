const AUTHORIZE_URL =
  "https://oauth.authorization.datagsm.kr/v1/oauth/authorize";

interface AuthorizeUrlParams {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}

export function createAuthorizeUrl(params: AuthorizeUrlParams): string {
  const query = new URLSearchParams({
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    response_type: "code",
    code_challenge: params.codeChallenge,
    code_challenge_method: "S256",
    state: params.state,
  });
  return `${AUTHORIZE_URL}?${query}`;
}
