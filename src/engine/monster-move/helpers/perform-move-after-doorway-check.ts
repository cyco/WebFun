import noMovement from "./no-movement";
import { Point } from "src/util";
import { Monster, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import performMove from "./perform-move";
import isDoorway from "./is-doorway";

export default (direction: Point, monster: Monster, zone: Zone, engine: Engine) => {
	const target = monster.position.byAdding(direction);
	if (zone.getTile(target.x, target.y, Zone.Layer.Object)) return noMovement(monster, zone, engine);
	let move = false;

	if (!isDoorway(zone, target)) move = true;

	if (move) {
		monster.position.add(direction);
	} else {
		direction = new Point(0, 0);
	}

	return performMove(monster, direction, move, zone, engine);
};
