import type { ClientRole } from "./positions";

export interface PostClientInfoRequest {
  clientRole: ClientRole;
}

export interface PostClientInfoResponse {
  accessToken: string; // 역할이 반영된 새 accessToken
}
