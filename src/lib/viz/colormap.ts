export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

const STOPS: ReadonlyArray<readonly [number, RgbColor]> = [
  [0, { r: 44, g: 62, b: 180 }],
  [0.25, { r: 34, g: 168, b: 196 }],
  [0.5, { r: 118, g: 185, b: 0 }],
  [0.75, { r: 232, g: 176, b: 32 }],
  [1, { r: 214, g: 64, b: 36 }],
];

export function scalarToRgb(value: number, min: number, max: number): RgbColor {
  const span = max - min;
  const t = span === 0 ? 0.5 : clamp01((value - min) / span);
  for (let i = 0; i < STOPS.length - 1; i += 1) {
    const current = STOPS[i];
    const next = STOPS[i + 1];
    if (t >= current[0] && t <= next[0]) {
      const local = (t - current[0]) / (next[0] - current[0]);
      return {
        r: Math.round(lerp(current[1].r, next[1].r, local)),
        g: Math.round(lerp(current[1].g, next[1].g, local)),
        b: Math.round(lerp(current[1].b, next[1].b, local)),
      };
    }
  }
  return STOPS[STOPS.length - 1][1];
}

export function rgbToCss(color: RgbColor): string {
  return `rgb(${color.r} ${color.g} ${color.b})`;
}

export function rgbToHex(color: RgbColor): string {
  const toHex = (channel: number) => channel.toString(16).padStart(2, "0");
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

export function scalarToHex(value: number, min: number, max: number): string {
  return rgbToHex(scalarToRgb(value, min, max));
}

export function legendStops(
  min: number,
  max: number,
): Array<{ t: number; color: string; value: number }> {
  return [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    t,
    color: scalarToHex(min + (max - min) * t, min, max),
    value: min + (max - min) * t,
  }));
}
