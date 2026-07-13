import type { ClientRole } from "./positions";

export interface PostClientInfoRequest {
  clientRole: ClientRole;
}

export interface PostClientInfoResponse {
  accessToken?: string;
}
