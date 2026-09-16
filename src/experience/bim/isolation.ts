import type { LayerId } from "@/experience/state/types";

export function parseStoreyNumber(level: string): number | null {
  const match = /^L(\d{2})$/.exec(level);
  if (!match) {
    return null;
  }
  return Number.parseInt(match[1], 10);
}

export function levelContains(elementLevel: string, isolatedLevel: string): boolean {
  if (elementLevel === isolatedLevel) {
    return true;
  }

  const isolatedStorey = parseStoreyNumber(isolatedLevel);
  const range = /^L(\d{2})-L(\d{2})$/.exec(elementLevel);
  if (isolatedStorey !== null && range) {
    const start = Number.parseInt(range[1], 10);
    const end = Number.parseInt(range[2], 10);
    return isolatedStorey >= start && isolatedStorey <= end;
  }

  return false;
}

export function matchesIsolation(
  element: { level: string; discipline: string },
  isolatedLevel: string | null,
  isolatedDiscipline: LayerId | null,
): boolean {
  if (isolatedDiscipline && element.discipline !== isolatedDiscipline) {
    return false;
  }
  if (isolatedLevel && !levelContains(element.level, isolatedLevel)) {
    return false;
  }
  return true;
}

export function storeyFromInstanceKey(key: string): number | null {
  const match = /-L(\d{1,2})(?:-|$)/.exec(key) ?? /slab-L(\d{2})/.exec(key);
  if (!match) {
    return null;
  }
  return Number.parseInt(match[1], 10);
}
