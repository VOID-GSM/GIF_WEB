export type CalendarEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color: string;
};

export const PRESET_COLOR_MAP = {
  red: "var(--color-red)",
  orange: "var(--color-orange)",
  yellow: "var(--color-yellow)",
  green: "var(--color-green)",
  blue: "var(--color-blue)",
  purple: "var(--color-purple)",
  gray: "var(--color-gray)",
} as const;
export type PresetColorKey = keyof typeof PRESET_COLOR_MAP;

export function resolveColor(color: string): string {
  return PRESET_COLOR_MAP[color as PresetColorKey] ?? color;
}
