import type { ReactNode } from "react";

import { Button } from "@/components/common/Button";
import { experienceActions } from "@/experience/state";

export function ExperienceDrawer({
  title,
  testId,
  children,
}: {
  title: string;
  testId: string;
  children: ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center bg-canvas/70 p-3 backdrop-blur-sm md:items-center"
      data-testid={testId}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-md border border-border bg-surface p-4 shadow-xl md:p-6">
        <div className="mb-3 flex justify-end">
          <Button
            variant="ghost"
            data-testid="close-drawer"
            onClick={() => experienceActions.setOpenPanel(null)}
          >
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
