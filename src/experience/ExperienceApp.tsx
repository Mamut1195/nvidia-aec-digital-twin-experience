import { useEffect } from "react";

import { ExperienceErrorBoundary } from "@/components/shell/ExperienceErrorBoundary";
import { ExperienceShell } from "@/components/shell/ExperienceShell";
import { startGuidedTour } from "@/experience/tour/tour-engine";

function TourQueryBootstrap() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tour") === "1") {
      startGuidedTour();
    }
  }, []);
  return null;
}

export default function ExperienceApp() {
  return (
    <ExperienceErrorBoundary>
      <TourQueryBootstrap />
      <ExperienceShell />
    </ExperienceErrorBoundary>
  );
}
