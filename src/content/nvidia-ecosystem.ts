export type EcosystemLane = "authoring" | "engineering" | "nvidia";

export interface EcosystemProduct {
  id: string;
  name: string;
  lane: EcosystemLane;
  whatItIs: string;
  aecUse: string;
  complements: string;
  demoShows: string;
  officialUrl: string;
  officialLabel: string;
}

export const AUTHORING_PRODUCTS: EcosystemProduct[] = [
  {
    id: "revit",
    name: "Autodesk Revit",
    lane: "authoring",
    whatItIs:
      "A BIM authoring application used to model buildings and produce coordinated design documents.",
    aecUse: "Architects and engineers author architectural, structural and MEP models here.",
    complements:
      "Exports or publishes project data that can be composed downstream — it is not replaced by NVIDIA software.",
    demoShows:
      "Some inspector rows use the label “Example authoring source: Revit” to illustrate that workflow. This geometry was not exported from Revit.",
    officialUrl: "https://www.autodesk.com/products/revit/overview",
    officialLabel: "Autodesk Revit overview",
  },
  {
    id: "rhino",
    name: "Rhino",
    lane: "authoring",
    whatItIs:
      "A NURBS-focused design modeler used for freeform architecture and industrial design.",
    aecUse: "Concept massing, complex surfaces and computational design.",
    complements:
      "Can contribute geometry into a composed project stage alongside BIM and analysis models.",
    demoShows: "Shown only as an authoring-class tool on this map. No Rhino file is loaded.",
    officialUrl: "https://www.rhino3d.com/",
    officialLabel: "Rhino 3D",
  },
  {
    id: "gis",
    name: "GIS / Civil context",
    lane: "authoring",
    whatItIs: "Site, city and infrastructure context from GIS or civil-design tools.",
    aecUse: "Terrain, roads, floodplain context and existing conditions around the building.",
    complements: "Provides the site envelope that building BIM and simulation results sit inside.",
    demoShows: "Procedural terrain and roads stand in for that site context.",
    officialUrl: "https://www.esri.com/en-us/what-is-gis/overview",
    officialLabel: "What is GIS",
  },
];

export const ENGINEERING_PRODUCTS: EcosystemProduct[] = [
  {
    id: "opensees",
    name: "OpenSees",
    lane: "engineering",
    whatItIs: "An open earthquake-engineering / structural-analysis framework.",
    aecUse: "Authoritative structural analysis when a validated model and codes require it.",
    complements:
      "Solvers remain authoritative. A digital twin may visualize results; it does not replace the check.",
    demoShows: "Structural mode shows an illustrative precomputed field — not an OpenSees run.",
    officialUrl: "https://opensees.berkeley.edu/",
    officialLabel: "OpenSees",
  },
  {
    id: "openfoam",
    name: "OpenFOAM",
    lane: "engineering",
    whatItIs: "An open-source CFD toolbox used for high-fidelity fluid simulation.",
    aecUse: "Wind, ventilation and other flow studies that produce reference fields.",
    complements:
      "Physics AI surrogates, when used, are trained or validated against trusted solver data.",
    demoShows:
      "Wind visualization is a precomputed educational field, not a live OpenFOAM solve or PhysicsNeMo inference.",
    officialUrl: "https://www.openfoam.com/",
    officialLabel: "OpenFOAM",
  },
  {
    id: "hec",
    name: "HEC hydrology / hydraulics",
    lane: "engineering",
    whatItIs:
      "USACE hydrology and hydraulics tools used for rainfall-runoff and channel/flood studies.",
    aecUse: "Translate weather and catchment inputs into flood depths and velocities.",
    complements: "Weather AI can inform these workflows; it is not itself the hydraulic solver.",
    demoShows:
      "Flood mode is a precomputed surface driven by authored weather scenarios. Earth-2 is not the hydraulic solver here.",
    officialUrl: "https://www.hec.usace.army.mil/",
    officialLabel: "HEC",
  },
];

export const NVIDIA_PRODUCTS: EcosystemProduct[] = [
  {
    id: "openusd",
    name: "OpenUSD",
    lane: "nvidia",
    whatItIs:
      "A scene-description and composition framework for assembling complex 3D worlds from layered contributions.",
    aecUse:
      "Compose architecture, structure, MEP, site and equipment into one project stage without flattening authoring tools.",
    complements:
      "Sits downstream of Revit/Rhino/solvers. It does not author BIM the way Revit does.",
    demoShows:
      "An educational layer/reference diagram. The browser scene is not parsed live from USD.",
    officialUrl: "https://openusd.org/",
    officialLabel: "OpenUSD",
  },
  {
    id: "omniverse",
    name: "NVIDIA Omniverse",
    lane: "nvidia",
    whatItIs:
      "Libraries, APIs, SDKs and services for industrial digital-twin and Physical AI applications, including OpenUSD workflows.",
    aecUse: "Build composed, simulated and streamed 3D applications around project data.",
    complements:
      "Does not primarily replace Revit or Rhino authoring. It can sit alongside authoring and visualization tools.",
    demoShows:
      "This static web demo explains the role. It does not stream a live Omniverse Kit session.",
    officialUrl: "https://docs.omniverse.nvidia.com/ov-web-sdk/latest/index.html",
    officialLabel: "Omniverse Web SDK docs",
  },
  {
    id: "physicsnemo",
    name: "NVIDIA PhysicsNeMo",
    lane: "nvidia",
    whatItIs:
      "An open-source Physics AI framework for building, training and running physics-ML models.",
    aecUse:
      "Learn surrogate behavior from high-fidelity solver data so design exploration can be faster after validation.",
    complements:
      "Does not replace OpenFOAM or other trusted solvers. Validation against reference data remains necessary.",
    demoShows:
      "Wind mode visualizes a precomputed field and an educational PhysicsNeMo workflow diagram. No live PhysicsNeMo inference runs here.",
    officialUrl: "https://docs.nvidia.com/physicsnemo/latest/overview.html",
    officialLabel: "PhysicsNeMo overview",
  },
  {
    id: "metropolis",
    name: "NVIDIA Metropolis",
    lane: "nvidia",
    whatItIs: "Models, libraries and blueprints for video-analytics AI agents from edge to cloud.",
    aecUse: "Understand construction-site cameras: activity, safety and progress.",
    complements: "Works with recorded or live video infrastructure — it is not a BIM modeler.",
    demoShows: "Video AI is a later-phase pre-indexed local dataset, not live Metropolis analysis.",
    officialUrl: "https://developer.nvidia.com/metropolis",
    officialLabel: "NVIDIA Metropolis",
  },
  {
    id: "vss",
    name: "NVIDIA VSS",
    lane: "nvidia",
    whatItIs: "NVIDIA blueprint for video search, summarization and interactive Q&A.",
    aecUse: "Ask questions of construction footage and jump to relevant events.",
    complements:
      "A real deployment ingests video through VLM/LLM components. This demo will not claim that pipeline is running.",
    demoShows: "Later-phase local event index only.",
    officialUrl: "https://build.nvidia.com/nvidia/video-search-and-summarization/blueprintcard",
    officialLabel: "VSS blueprint",
  },
  {
    id: "earth2",
    name: "NVIDIA Earth-2",
    lane: "nvidia",
    whatItIs: "A family of open weather and climate AI models, libraries and frameworks.",
    aecUse: "Inform weather-driven engineering workflows that then use hydrology and hydraulics.",
    complements: "Earth-2 is not itself the hydraulic flood solver.",
    demoShows:
      "Flood/weather mode is a workflow demo with authored scenarios and a precomputed flood surface. Earth-2 is not the hydraulic solver.",
    officialUrl: "https://www.nvidia.com/en-us/high-performance-computing/earth-2/",
    officialLabel: "NVIDIA Earth-2",
  },
  {
    id: "cuopt",
    name: "NVIDIA cuOpt",
    lane: "nvidia",
    whatItIs: "An open-source GPU-accelerated decision-optimization engine.",
    aecUse: "Explore routing, fleet and resource-allocation problems on a construction site.",
    complements: "Optimization sits on top of logistics data; it does not author the building.",
    demoShows:
      "Logistics playback is a later phase. Routes will be labeled as a cuOpt-style workflow demo unless actually generated by cuOpt.",
    officialUrl: "https://docs.nvidia.com/cuopt/index.html",
    officialLabel: "cuOpt docs",
  },
  {
    id: "isaac",
    name: "NVIDIA Isaac Sim",
    lane: "nvidia",
    whatItIs:
      "An open-source reference framework on Omniverse libraries for robotics simulation, testing and synthetic data.",
    aecUse: "Test robots, sensors and autonomy in a virtual site before deployment.",
    complements:
      "Isaac Sim is not running in this browser. The later robotics mode is a mission animation.",
    demoShows: "Robotics mode is a later-phase workflow animation.",
    officialUrl: "https://developer.nvidia.com/isaac/sim/",
    officialLabel: "Isaac Sim",
  },
  {
    id: "nim",
    name: "NVIDIA NIM",
    lane: "nvidia",
    whatItIs: "NVIDIA inference microservices for deploying optimized AI models.",
    aecUse: "Serve validated models (vision, language, physics surrogates) in a production twin.",
    complements: "A deployment concern for real AI services — not required by this static demo.",
    demoShows: "No NIM endpoint is called. This site is static files in the browser.",
    officialUrl: "https://docs.nvidia.com/nim/",
    officialLabel: "NIM docs",
  },
];

export const ALL_ECOSYSTEM_PRODUCTS: EcosystemProduct[] = [
  ...AUTHORING_PRODUCTS,
  ...ENGINEERING_PRODUCTS,
  ...NVIDIA_PRODUCTS,
];

export function getEcosystemProduct(id: string): EcosystemProduct | undefined {
  return ALL_ECOSYSTEM_PRODUCTS.find((product) => product.id === id);
}
