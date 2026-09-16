import type { QualityLevel } from "@/experience/state/types";
import { assertNever } from "@/lib/assert-never";

export type ContextLod = "high" | "low";

export interface DeviceHints {
  deviceMemoryGb?: number;
  hardwareConcurrency?: number;
  saveData?: boolean;
  prefersReducedMotion?: boolean;
  isCoarsePointer?: boolean;
}

export interface QualitySettings {
  tier: "high" | "low";
  dpr: number;
  shadows: boolean;
  shadowMapSize: number;
  particles: boolean;
  particleCount: number;
  contextLod: ContextLod;
  antialias: boolean;
  contactShadows: boolean;
}

export const QUALITY_PRESETS: Record<"high" | "low", QualitySettings> = {
  low: {
    tier: "low",
    dpr: 1,
    shadows: false,
    shadowMapSize: 512,
    particles: false,
    particleCount: 0,
    contextLod: "low",
    antialias: false,
    contactShadows: false,
  },
  high: {
    tier: "high",
    dpr: 1.75,
    shadows: true,
    shadowMapSize: 2048,
    particles: true,
    particleCount: 420,
    contextLod: "high",
    antialias: true,
    contactShadows: true,
  },
};

export function getDeviceHints(
  io: {
    navigator?: Navigator;
    matchMedia?: typeof matchMedia;
  } = globalThis,
): DeviceHints {
  const nav = io.navigator;
  if (!nav) {
    return {};
  }

  const connection = (nav as Navigator & { connection?: { saveData?: boolean } }).connection;
  const deviceMemory = (nav as Navigator & { deviceMemory?: number }).deviceMemory;
  const matchMediaFn = io.matchMedia;

  return {
    deviceMemoryGb: deviceMemory,
    hardwareConcurrency: nav.hardwareConcurrency,
    saveData: connection?.saveData,
    prefersReducedMotion: matchMediaFn?.("(prefers-reduced-motion: reduce)").matches,
    isCoarsePointer: matchMediaFn?.("(pointer: coarse)").matches,
  };
}

export function pickAutoTier(hints: DeviceHints = {}): "high" | "low" {
  if (hints.saveData) {
    return "low";
  }
  if (hints.deviceMemoryGb !== undefined && hints.deviceMemoryGb <= 4) {
    return "low";
  }
  if (hints.hardwareConcurrency !== undefined && hints.hardwareConcurrency <= 4) {
    return "low";
  }
  if (hints.isCoarsePointer) {
    return "low";
  }
  return "high";
}

export function resolveQuality(level: QualityLevel, hints: DeviceHints = {}): QualitySettings {
  switch (level) {
    case "low":
      return QUALITY_PRESETS.low;
    case "high":
      return QUALITY_PRESETS.high;
    case "auto":
      return QUALITY_PRESETS[pickAutoTier(hints)];
    default:
      return assertNever(level, "quality level");
  }
}

export function qualityReducesGpuCost(low: QualitySettings, high: QualitySettings): boolean {
  return (
    low.dpr < high.dpr &&
    low.shadows === false &&
    high.shadows === true &&
    low.particleCount < high.particleCount &&
    low.antialias === false &&
    high.antialias === true &&
    low.shadowMapSize < high.shadowMapSize &&
    low.contextLod === "low" &&
    high.contextLod === "high"
  );
}
