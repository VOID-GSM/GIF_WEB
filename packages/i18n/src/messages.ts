import commonKo from "../messages/ko.json";
import commonJa from "../messages/ja.json";

import { DEFAULT_LOCALE, type Locale } from "./config";

export type Messages = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Messages =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// base 위에 override 를 덮어써서, 번역이 빠진 키는 base(ko) 문구로 남게 한다.
export function deepMerge(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = result[key];
    result[key] =
      isPlainObject(baseValue) && isPlainObject(value)
        ? deepMerge(baseValue, value)
        : value;
  }
  return result;
}

export const COMMON_MESSAGES: Record<Locale, Messages> = {
  ko: commonKo,
  ja: commonJa,
};

// 공통 메시지 + 앱 메시지를 합치고, 기본 언어(ko)를 폴백으로 깐다.
export function buildMessages(
  locale: Locale,
  appMessages: Record<Locale, Messages>,
): Messages {
  const base = deepMerge(
    COMMON_MESSAGES[DEFAULT_LOCALE],
    appMessages[DEFAULT_LOCALE],
  );
  if (locale === DEFAULT_LOCALE) return base;
  return deepMerge(
    base,
    deepMerge(COMMON_MESSAGES[locale], appMessages[locale]),
  );
}
