import { STRUCTURAL_DISCLAIMER } from "@/experience/scene/site-impact";

export const PHYSICS_NEMO_STEPS = [
  {
    id: "solver",
    title: "High-fidelity solver",
    body: "A trusted CFD or structural solver (for example OpenFOAM) produces reference fields for a given geometry and boundary condition. That solver remains the authoritative analysis, not this browser scene.",
  },
  {
    id: "training",
    title: "Training / reference data",
    body: "Solver outputs become training and validation data. The data must represent the design space the surrogate is allowed to answer.",
  },
  {
    id: "surrogate",
    title: "PhysicsNeMo surrogate",
    body: "NVIDIA PhysicsNeMo is an open-source Physics AI framework for building, training and running physics-ML models. A surrogate approximates selected solver behavior; it is not a replacement for the solver.",
  },
  {
    id: "inference",
    title: "Validated fast inference",
    body: "After the model is validated against held-out solver cases, inference can make design exploration more responsive. Validation against the reference solver remains necessary. This demo does not quote speedups or run live PhysicsNeMo.",
  },
] as const;

export const PHYSICS_NEMO_OFFICIAL_URL = "https://docs.nvidia.com/physicsnemo/latest/overview.html";
export const PHYSICS_NEMO_OFFICIAL_LABEL = "PhysicsNeMo overview";

export const PHYSICS_NEMO_TRUTH =
  "This wind field is a precomputed educational dataset. The browser is not running a CFD solver or PhysicsNeMo inference.";

export const EARTH2_STEPS = [
  {
    id: "weather",
    title: "Weather AI",
    body: "NVIDIA Earth-2 is a family of open weather and climate AI models, libraries and frameworks. In a production workflow it can inform rainfall and wind scenarios that engineering teams then take downstream.",
  },
  {
    id: "hydrology",
    title: "Hydrology",
    body: "Catchment and runoff models translate rainfall into inflows. Earth-2 is not this step.",
  },
  {
    id: "hydraulics",
    title: "Hydraulics",
    body: "A hydraulic flood solver (for example HEC tools) computes depths and velocities on the site. Earth-2 is not the hydraulic flood solver in this demo.",
  },
  {
    id: "twin",
    title: "Impact twin",
    body: "The digital twin visualizes flood extent, roads and buildings so teams can discuss exposure. The surface you see here is a precomputed time series.",
  },
] as const;

export const EARTH2_OFFICIAL_URL =
  "https://www.nvidia.com/en-us/high-performance-computing/earth-2/";
export const EARTH2_OFFICIAL_LABEL = "NVIDIA Earth-2";

export const EARTH2_NOT_SOLVER =
  "Earth-2 is not itself the hydraulic flood solver in this demo. Weather AI can feed hydrology and hydraulics; those domain solvers remain responsible for flood depths.";

export const STRUCTURAL_NOT_DESIGN_CHECK = STRUCTURAL_DISCLAIMER;

export const STRUCTURAL_WORKFLOW_NOTE =
  "Illustrative/precomputed result visualization. A real engineering workflow must use validated analysis models and applicable design codes.";
