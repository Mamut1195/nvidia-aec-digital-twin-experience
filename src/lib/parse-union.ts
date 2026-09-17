export function parseUnion<T extends string>(
  value: string,
  allowed: readonly T[],
  label: string,
): T {
  if ((allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  throw new Error(`Unknown ${label}: ${value}`);
}

export function parseNumericUnion<T extends number>(
  value: string,
  allowed: readonly T[],
  label: string,
): T {
  const numeric = Number(value);
  if ((allowed as readonly number[]).includes(numeric)) {
    return numeric as T;
  }
  throw new Error(`Unknown ${label}: ${value}`);
}
