import { twinReplaySchema, type TwinReplay } from "@/lib/data/schemas/twin";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const TWIN_REPLAY_DATA_URL = "/data/twin/replay.json";

export function createTwinReplayAdapter(url = TWIN_REPLAY_DATA_URL): ScenarioAdapter<TwinReplay> {
  return createStaticAdapter(twinReplaySchema, url);
}
