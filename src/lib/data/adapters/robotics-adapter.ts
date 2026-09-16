import { robotMissionSchema, type RobotMission } from "@/lib/data/schemas/robotics";

import { createStaticAdapter, type ScenarioAdapter } from "./types";

export const ROBOT_MISSION_DATA_URL = "/data/robotics/mission.json";

export function createRobotMissionAdapter(
  url = ROBOT_MISSION_DATA_URL,
): ScenarioAdapter<RobotMission> {
  return createStaticAdapter(robotMissionSchema, url);
}
