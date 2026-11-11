import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { LOCALE_COOKIE, TIME_ZONE, resolveLocale, type Locale } from "./config";
import { buildMessages, type Messages } from "./messages";

interface CreateRequestConfigOptions {
  appMessages: Record<Locale, Messages>;
  // 지정하면 쿠키·브라우저 언어와 관계없이 이 언어로 고정한다.
  fixedLocale?: Locale;
}

export function createRequestConfig({
  appMessages,
  fixedLocale,
}: CreateRequestConfigOptions) {
  return getRequestConfig(async () => {
    const locale =
      fixedLocale ??
      resolveLocale(
        (await cookies()).get(LOCALE_COOKIE)?.value,
        (await headers()).get("accept-language"),
      );

    return {
      locale,
      timeZone: TIME_ZONE,
      messages: buildMessages(locale, appMessages),
    };
  });
}
