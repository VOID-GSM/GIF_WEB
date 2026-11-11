import { INTL_LOCALES, TIME_ZONE, formatRelative, isLocale } from "@repo/i18n";

// 알림 목록은 최신순이라 최근 항목일수록 상대 시간이 읽기 쉽다.
// 일주일이 넘어가면 상대 표기가 오히려 헷갈려서 날짜로 보여준다.
// 타입은 string이지만 서버가 배열([년, 월, 일, 시, 분, 초, 나노초])로 내려주는 경우가 있어 대응한다.
const toDate = (createdAt: unknown): Date | null => {
  if (Array.isArray(createdAt)) {
    const [year, month = 1, day = 1, hour = 0, minute = 0, second = 0] =
      createdAt.map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  }
  if (typeof createdAt !== "string" && typeof createdAt !== "number") return null;
  return new Date(createdAt);
};

export const formatNotificationTime = (
  createdAt: string,
  locale: string = "ko",
): string => {
  const created = toDate(createdAt);
  if (!created || Number.isNaN(created.getTime())) return "";

  const lang = isLocale(locale) ? locale : "ko";
  return (
    formatRelative(created, lang) ??
    created.toLocaleDateString(INTL_LOCALES[lang], {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
};
