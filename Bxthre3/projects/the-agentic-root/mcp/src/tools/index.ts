/**
 * Agentic Tools - Workforce Management, Projects, Memory, War Room, Grants
 */

import { AgentOSServer } from "../server.js";
import * as workforce from "./workforce.js";
import * as projects from "./projects.js";
import * as memory from "./memory.js";
import * as warroom from "./warroom.js";
import * as grants from "./grants.js";
import * as analytics from "./analytics.js";

export function registerAllTools(server: AgentOSServer) {
  workforce.register(server);
  projects.register(server);
  memory.register(server);
  warroom.register(server);
  grants.register(server);
  analytics.register(server);
}
