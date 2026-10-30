/** Derive the hero palette (title colour + pill tint) from an anime's AniList cover colour. */

function hexToHsl(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function heroPalette(hex: string | null | undefined) {
  const hsl = hex ? hexToHsl(hex) : null;
  if (!hsl) return { title: "hsl(36 58% 72%)", tint: "hsl(0 45% 20%)" };
  const [h, s] = hsl;
  return {
    // light, readable version of the poster's dominant colour
    title: `hsl(${h.toFixed(0)} ${clamp(s, 38, 80).toFixed(0)}% 74%)`,
    // dark version used behind the pills
    tint: `hsl(${h.toFixed(0)} ${clamp(s * 0.7, 28, 62).toFixed(0)}% 21%)`,
  };
}
