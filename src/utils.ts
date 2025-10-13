export function cn(...xs: Array<string | undefined | false>) {
  return xs.filter(Boolean).join(" ");
}
