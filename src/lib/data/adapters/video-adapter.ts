import { videoEventIndexSchema, type VideoEventIndex } from "@/lib/data/schemas/video";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const VIDEO_DATA_URL = "/data/video/events.json";

export function createVideoEventAdapter(url = VIDEO_DATA_URL): ScenarioAdapter<VideoEventIndex> {
  return createStaticAdapter(videoEventIndexSchema, url);
}
