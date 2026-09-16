import { useCursor } from "@react-three/drei";
import { create } from "zustand";

import { experienceActions, useExperienceStore } from "@/experience/state";

import { SCENE_COLORS } from "./colors";
import { getSelectable, SELECTABLES, type SelectableRecord } from "./selectables";

interface HoverState {
  hoveredElementId: string | null;
  setHovered: (id: string | null) => void;
}

export const useHoverStore = create<HoverState>((set) => ({
  hoveredElementId: null,
  setHovered: (id) => set({ hoveredElementId: id }),
}));

export function CursorSync() {
  const hovered = useHoverStore((state) => state.hoveredElementId);
  useCursor(Boolean(hovered));
  return null;
}

function PickProxy({ item }: { item: SelectableRecord }) {
  const layerVisible = useExperienceStore((state) => state.layerVisibility[item.discipline]);
  const setHovered = useHoverStore((state) => state.setHovered);

  if (!layerVisible) {
    return null;
  }

  return (
    <mesh
      position={item.position}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(item.id);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setHovered(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        experienceActions.selectElement(item.id);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <boxGeometry args={item.size} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

function HighlightBox({ item, mode }: { item: SelectableRecord; mode: "hover" | "selected" }) {
  const scale = mode === "selected" ? 1.04 : 1.02;
  const color = mode === "selected" ? SCENE_COLORS.highlightSelect : SCENE_COLORS.highlightHover;
  const size: [number, number, number] = [
    item.size[0] * scale,
    item.size[1] * scale,
    item.size[2] * scale,
  ];

  return (
    <mesh position={item.position}>
      <boxGeometry args={size} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={mode === "selected" ? 0.28 : 0.14}
        depthWrite={false}
      />
    </mesh>
  );
}

export function SelectionSystem() {
  const selectedId = useExperienceStore((state) => state.selectedElementId);
  const hoveredId = useHoverStore((state) => state.hoveredElementId);
  const selected = selectedId ? getSelectable(selectedId) : undefined;
  const hovered = hoveredId && hoveredId !== selectedId ? getSelectable(hoveredId) : undefined;

  return (
    <group name="SelectionSystem">
      {SELECTABLES.map((item) => (
        <PickProxy key={item.id} item={item} />
      ))}
      {hovered ? <HighlightBox item={hovered} mode="hover" /> : null}
      {selected ? <HighlightBox item={selected} mode="selected" /> : null}
      <CursorSync />
    </group>
  );
}
