import type { ClientRole } from "./positions";

export interface PatchClientInfoRequest {
  clientRole: ClientRole;
}
