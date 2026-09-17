import { matchesIsolation } from "@/experience/bim/isolation";
import {
  findStructuralResult,
  selectStructuralLoadCase,
  structuralRange,
  structuralScalar,
} from "@/experience/engineering/selectors";
import { useEnsureStructuralDataset } from "@/experience/engineering/use-structural-dataset";
import { experienceActions, useExperienceStore } from "@/experience/state";
import { DEMO_BIM_ELEMENTS } from "@/lib/data/bim/demo-elements";
import { scalarToHex } from "@/lib/viz/colormap";

export function StructuralOverlay() {
  const mode = useExperienceStore((state) => state.mode);
  const loadCaseId = useExperienceStore((state) => state.scenarioControls.structuralLoadCase);
  const resultType = useExperienceStore((state) => state.scenarioControls.structuralResultType);
  const deformationScale = useExperienceStore(
    (state) => state.scenarioControls.structuralDeformationScale,
  );
  const isolatedLevel = useExperienceStore((state) => state.isolatedLevel);
  const isolatedDiscipline = useExperienceStore((state) => state.isolatedDiscipline);
  const { dataset } = useEnsureStructuralDataset();

  if (mode !== "structure" || !dataset) {
    return null;
  }

  const loadCase = selectStructuralLoadCase(dataset, loadCaseId);
  const range = structuralRange(loadCase, resultType);

  return (
    <group name="StructuralOverlay">
      {DEMO_BIM_ELEMENTS.filter((element) => element.discipline === "structure").map((element) => {
        if (!matchesIsolation(element, isolatedLevel, isolatedDiscipline)) {
          return null;
        }
        const result = findStructuralResult(loadCase, element.id);
        if (!result) {
          return null;
        }
        const scalar = structuralScalar(result, resultType);
        const vector = result.displacementVector ?? [0, 0, 0];
        const position: [number, number, number] = [
          element.position[0] + vector[0] * deformationScale,
          element.position[1] + vector[1] * deformationScale,
          element.position[2] + vector[2] * deformationScale,
        ];
        return (
          <mesh
            key={element.id}
            position={position}
            onClick={(event) => {
              event.stopPropagation();
              experienceActions.selectElement(element.id);
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
          >
            <boxGeometry args={element.size} />
            <meshStandardMaterial
              color={scalarToHex(scalar, range.min, range.max)}
              emissive={scalarToHex(scalar, range.min, range.max)}
              emissiveIntensity={0.22}
              roughness={0.55}
              metalness={0.08}
            />
          </mesh>
        );
      })}
    </group>
  );
}
