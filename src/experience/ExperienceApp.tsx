import { ExperienceErrorBoundary } from "@/components/shell/ExperienceErrorBoundary";
import { ExperienceShell } from "@/components/shell/ExperienceShell";

export default function ExperienceApp() {
  return (
    <ExperienceErrorBoundary>
      <ExperienceShell />
    </ExperienceErrorBoundary>
  );
}
