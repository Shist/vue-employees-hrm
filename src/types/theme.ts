export type ITheme = "Light" | "Dark" | "Device settings";

export function isTheme(value: unknown): value is ITheme {
  return value === "Light" || value === "Dark" || value === "Device settings";
}
