import { Button } from "@/components/common/Button";
import { Panel } from "@/components/common/Panel";
import { getBimElement, useEnsureBimDataset } from "@/experience/bim/use-bim-dataset";
import { getSelectable } from "@/experience/scene/selectables";
import { experienceActions, useExperienceStore } from "@/experience/state";

function Field({ label, value, testId }: { label: string; value: string; testId?: string }) {
  return (
    <>
      <dt className="text-muted">{label}</dt>
      <dd className="min-w-0 break-words" data-testid={testId}>
        {value}
      </dd>
    </>
  );
}

export function BimInspector() {
  const selectedElementId = useExperienceStore((state) => state.selectedElementId);
  const { dataset, status, error } = useEnsureBimDataset();
  const bim = getBimElement(selectedElementId, dataset);
  const selected = selectedElementId ? getSelectable(selectedElementId) : undefined;
  const properties = bim?.properties ?? {};

  return (
    <Panel title="BIM inspector">
      {status === "error" ? (
        <p className="mb-3 text-xs text-alert">{error ?? "BIM dataset failed to load."}</p>
      ) : null}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs" data-testid="bim-inspector">
        <Field label="ID" value={selectedElementId ?? "none"} testId="selected-element-id" />
        <Field label="Name" value={bim?.name ?? selected?.name ?? "—"} />
        <Field
          label="Category"
          value={bim?.category ?? selected?.category ?? "—"}
          testId="bim-category"
        />
        <Field
          label="Discipline"
          value={bim?.discipline ?? selected?.discipline ?? "—"}
          testId="bim-discipline"
        />
        <Field label="Level" value={bim?.level ?? selected?.level ?? "—"} testId="bim-level" />
        <Field label="Material" value={bim?.material ?? "—"} testId="bim-material" />
        <Field label="Dimensions" value={bim?.dimensions ?? "—"} testId="bim-dimensions" />
        <Field
          label="Source"
          value={bim?.sourceLabel ?? (selected ? "Demo BIM dataset" : "—")}
          testId="bim-source"
        />
      </dl>
      {Object.keys(properties).length > 0 ? (
        <dl
          className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs"
          data-testid="bim-properties"
        >
          {Object.entries(properties).map(([key, value]) => (
            <Field key={key} label={key} value={String(value)} />
          ))}
        </dl>
      ) : null}
      <Button
        className="mt-3 w-full"
        variant="ghost"
        disabled={!selectedElementId}
        data-testid="clear-selection"
        onClick={() => experienceActions.selectElement(null)}
      >
        Clear selection
      </Button>
      <button
        type="button"
        className="sr-only"
        data-testid="select-sample"
        onClick={() => experienceActions.selectElement("STR-COL-L01-C01")}
      >
        Select sample column
      </button>
      <p className="mt-2 text-xs text-muted">
        Tap or click a highlighted object. Source labels are truthful: this is a demo BIM dataset,
        not a Revit export.
      </p>
    </Panel>
  );
}
