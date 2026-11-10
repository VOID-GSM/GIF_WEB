import { INTL_LOCALES, isLocale } from "@repo/i18n";

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

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

const JUST_NOW: Record<string, string> = {
  ko: "방금 전",
  ja: "たった今",
};

export const formatNotificationTime = (
  createdAt: string,
  locale: string = "ko",
): string => {
  const created = toDate(createdAt);
  if (!created || Number.isNaN(created.getTime())) return "";

  const lang = isLocale(locale) ? locale : "ko";
  const intlLocale = INTL_LOCALES[lang];
  const relative = new Intl.RelativeTimeFormat(intlLocale, { numeric: "always" });

  const diff = Date.now() - created.getTime();
  if (diff < MINUTE) return JUST_NOW[lang];
  if (diff < HOUR) return relative.format(-Math.floor(diff / MINUTE), "minute");
  if (diff < DAY) return relative.format(-Math.floor(diff / HOUR), "hour");
  if (diff < DAY * 7) return relative.format(-Math.floor(diff / DAY), "day");

  return created.toLocaleDateString(intlLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
