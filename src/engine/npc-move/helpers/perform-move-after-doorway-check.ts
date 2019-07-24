import noMovement from "./no-movement";
import { Point } from "src/util";
import { NPC, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import performMove from "./perform-move";
import isDoorway from "./is-doorway";

export default (direction: Point, npc: NPC, zone: Zone, engine: Engine) => {
	const target = npc.position.byAdding(direction);
	if (zone.getTile(target.x, target.y, Zone.Layer.Object)) return noMovement(npc, zone, engine);
	let move = false;

	if (!isDoorway(zone, target)) move = true;

	if (move) {
		npc.position.add(direction);
	} else {
		direction = new Point(0, 0);
	}

	return performMove(npc, direction, move, zone, engine);
};
