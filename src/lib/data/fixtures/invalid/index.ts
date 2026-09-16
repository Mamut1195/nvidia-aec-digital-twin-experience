export const invalidBimFixture = {
  projectId: "urban-construction-demonstrator",
  units: "inches",
  elements: [],
};

export const invalidStructuralFixture = {
  projectId: "urban-construction-demonstrator",
  loadCases: [
    {
      loadCase: "wind-uplift",
      sourceType: "LIVE INFERENCE",
      disclaimer: "",
      results: [],
    },
  ],
};

export const invalidWindFixture = {
  projectId: "urban-construction-demonstrator",
  scenarios: [
    {
      id: "live-cfd",
      speed: "hurricane",
      directionDeg: 400,
      sourceType: "INTERACTIVE WEB",
      referenceSolver: "fake-live",
      samplePoints: [],
      facadePressures: [],
    },
  ],
};

export const invalidFloodFixture = {
  projectId: "urban-construction-demonstrator",
  scenarios: [
    {
      id: "rain-bad",
      rainfallMmH: -10,
      sourceType: "WORKFLOW DEMO",
      timeSteps: [],
    },
  ],
};

export const invalidWeatherFixture = {
  projectId: "urban-construction-demonstrator",
  scenarios: [
    {
      scenario: "LiveEarth2",
      rainfallMmH: 100,
      windMs: 18,
      sourceType: "PRECOMPUTED",
      explanation: "Incorrect status for a weather workflow demo.",
    },
  ],
};

export const invalidVideoFixture = {
  videoId: "site-cam-01-demo",
  sourceType: "WORKFLOW DEMO",
  provenance: "bad",
  events: [
    {
      id: "evt-bad",
      start: 40,
      end: 10,
      type: "unknown_event",
      objects: [],
      summary: "",
      tags: [],
    },
  ],
};

export const invalidLogisticsFixture = {
  projectId: "urban-construction-demonstrator",
  nodes: [],
  fleet: [],
  tasks: [],
  baselinePlan: {},
  optimizedPlan: {},
};

export const invalidRobotMissionFixture = {
  id: "inspect-l01-l02",
  description: "Inspect columns.",
  sourceType: "PRECOMPUTED",
  start: [18, 0.2],
  waypoints: [],
  inspectionTargets: [],
  timeline: [],
};

export const invalidTwinReplayFixture = {
  id: "twin-loop-01",
  durationSeconds: 0,
  sourceType: "INTERACTIVE WEB",
  events: [
    {
      timeSeconds: -1,
      kind: "heartbeat",
      title: "",
      detail: "",
    },
  ],
};
