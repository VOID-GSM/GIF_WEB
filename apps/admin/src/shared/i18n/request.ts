import { createRequestConfig } from "@repo/i18n/server";

import ko from "../../../messages/ko.json";
import ja from "../../../messages/ja.json";

// admin 화면 문구는 아직 번역 전이라, 공통 컴포넌트까지 한국어로 고정한다.
export default createRequestConfig({
  appMessages: { ko, ja },
  fixedLocale: "ko",
});
