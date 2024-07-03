export type ITheme = "appDark" | "appLight";

export function isTheme(value: unknown): value is ITheme {
  return value === "appDark" || value === "appLight";
}
