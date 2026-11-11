import { apiClient } from "@repo/lib";

import {
  COOKIE_KEYS,
  isExternalAllowedPath,
  PUBLIC_HOME_PATH,
  REDIRECT_REASONS,
  SEARCH_PARAM_KEYS,
} from "../constants";
import { getCookie, setCookie } from "../utils";

// 외부 사용자가 재학생 전용 API를 호출하면 서버가 403 + 이 코드로 응답한다.
// (권한 부족의 나머지 경우는 ACCESS_DENIED)
export const EXTERNAL_USER_FORBIDDEN_CODE = "EXTERNAL_USER_FORBIDDEN";

let isRegistered = false;
// 동시에 여러 요청이 403 을 받아도 한 번만 이동한다.
let isReloading = false;

// account_type 쿠키가 없거나 오래된 세션(기능 배포 전 로그인 등)도 서버 응답으로 바로잡는다.
// 쿠키를 EXTERNAL 로 고쳐 두고, 재학생 전용 페이지였다면 공개 목록으로 보낸다.
// 공개 페이지라도 레이아웃이 재학생 메뉴로 그려져 있으므로 새로 불러와 외부 사용자 화면으로 바꾼다.
export function registerExternalForbiddenHandler() {
  if (isRegistered || typeof window === "undefined") return;
  isRegistered = true;

  apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
      const isExternalForbidden =
        error?.response?.status === 403 &&
        error.response.data?.code === EXTERNAL_USER_FORBIDDEN_CODE;

      if (isExternalForbidden && !isReloading) {
        // 이미 EXTERNAL 로 그려진 화면이면 메뉴가 맞으므로 다시 불러오지 않는다(새로고침 루프 방지).
        const wasExternal =
          getCookie(COOKIE_KEYS.ACCOUNT_TYPE) === "EXTERNAL";
        setCookie(COOKIE_KEYS.ACCOUNT_TYPE, "EXTERNAL");

        if (!isExternalAllowedPath(window.location.pathname)) {
          isReloading = true;
          const params = new URLSearchParams({
            [SEARCH_PARAM_KEYS.REASON]: REDIRECT_REASONS.EXTERNAL_ONLY,
          });
          // 레이아웃이 바뀐 계정 유형으로 메뉴를 다시 그리도록 새로 불러온다.
          window.location.replace(`${PUBLIC_HOME_PATH}?${params}`);
        } else if (!wasExternal) {
          isReloading = true;
          window.location.reload();
        }
      }

      return Promise.reject(error);
    },
  );
}
