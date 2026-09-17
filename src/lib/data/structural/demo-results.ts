import { STRUCTURAL_DISCLAIMER } from "@/experience/scene/site-impact";
import { BUILDING_HEIGHT_M } from "@/experience/scene/coordinates";
import { DEMO_BIM_ELEMENTS, type BimElementRecord } from "@/lib/data/bim/demo-elements";
import type {
  StructuralDataset,
  StructuralElementResult,
  StructuralLoadCase,
} from "@/lib/data/schemas/structural";

const PROJECT_ID = "urban-construction-demonstrator";

const LOAD_CASES = ["gravity", "lateral-x", "lateral-y"] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 4): number {
  const factor = 10 ** digits;
  const next = Math.round(value * factor) / factor;
  return Object.is(next, -0) ? 0 : next;
}

function unitNoise(id: string, salt: string): number {
  let hash = 2166136261;
  const text = `${id}:${salt}`;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function structuralElements(): BimElementRecord[] {
  return DEMO_BIM_ELEMENTS.filter((element) => element.discipline === "structure");
}

function resultFor(
  element: BimElementRecord,
  loadCase: (typeof LOAD_CASES)[number],
): StructuralElementResult {
  const [, y, z] = element.position;
  const x = element.position[0];
  const heightFactor = clamp(y / BUILDING_HEIGHT_M, 0, 1);
  const noise = unitNoise(element.id, loadCase) * 0.12 - 0.06;
  const edgeX = Math.abs(x) / 20.5;
  const edgeZ = Math.abs(z) / 15.5;
  const isColumn = element.category === "column";
  const isWall = element.category === "wall" || element.category === "core";

  if (loadCase === "gravity") {
    const displacement = round(0.0022 + heightFactor * 0.011 + Math.abs(noise) * 0.003);
    const utilization = round(
      clamp(
        (isColumn
          ? 0.38 + (1 - heightFactor) * 0.36
          : isWall
            ? 0.28 + (1 - heightFactor) * 0.22
            : 0.18 + heightFactor * 0.2) +
          noise * 0.12,
        0.08,
        0.96,
      ),
      3,
    );
    const axialForce = round(
      isColumn
        ? -(720 + (1 - heightFactor) * 1680 + noise * 120)
        : isWall
          ? -(400 + noise * 80)
          : 36 + noise * 90,
      1,
    );
    return {
      elementId: element.id,
      displacement,
      utilization,
      axialForce,
      displacementVector: [0, round(-displacement, 4), 0],
    };
  }

  if (loadCase === "lateral-x") {
    const displacement = round(
      0.0035 + heightFactor ** 1.55 * 0.052 + edgeX * 0.006 + Math.abs(noise) * 0.004,
    );
    const utilization = round(
      clamp(0.22 + heightFactor * 0.38 + edgeX * 0.22 + noise * 0.1, 0.1, 0.97),
      3,
    );
    const axialForce = round(
      isColumn ? (x >= 0 ? 1 : -1) * (180 + heightFactor * 620) : 24 + noise * 40,
      1,
    );
    return {
      elementId: element.id,
      displacement,
      utilization,
      axialForce,
      displacementVector: [
        round(displacement, 4),
        round(-displacement * 0.18, 4),
        round(noise * 0.004, 4),
      ],
    };
  }

  const displacement = round(
    0.0032 + heightFactor ** 1.5 * 0.048 + edgeZ * 0.007 + Math.abs(noise) * 0.004,
  );
  const utilization = round(
    clamp(0.2 + heightFactor * 0.36 + edgeZ * 0.24 + noise * 0.1, 0.1, 0.97),
    3,
  );
  const axialForce = round(
    isColumn ? (z >= 0 ? 1 : -1) * (160 + heightFactor * 580) : 20 + noise * 36,
    1,
  );
  return {
    elementId: element.id,
    displacement,
    utilization,
    axialForce,
    displacementVector: [
      round(noise * 0.004, 4),
      round(-displacement * 0.16, 4),
      round(displacement, 4),
    ],
  };
}

function loadCaseDataset(loadCase: (typeof LOAD_CASES)[number]): StructuralLoadCase {
  return {
    loadCase,
    sourceType: "PRECOMPUTED",
    disclaimer: STRUCTURAL_DISCLAIMER,
    results: structuralElements().map((element) => resultFor(element, loadCase)),
  };
}

export function createDemoStructuralDataset(): StructuralDataset {
  return {
    projectId: PROJECT_ID,
    loadCases: LOAD_CASES.map(loadCaseDataset),
  };
}

export const DEMO_STRUCTURAL_DATASET = createDemoStructuralDataset();
