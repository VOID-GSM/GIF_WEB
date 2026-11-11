import { createRequestConfig } from "@repo/i18n/server";

import ko from "../../../messages/ko.json";
import ja from "../../../messages/ja.json";

export default createRequestConfig({ appMessages: { ko, ja } });
