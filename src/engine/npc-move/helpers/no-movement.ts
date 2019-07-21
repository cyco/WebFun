import { NPC, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import { Point } from "src/util";
import performMove from "./perform-move";

export default (npc: NPC, zone: Zone, engine: Engine) =>
	performMove(npc, new Point(0, 0), false, zone, engine);
