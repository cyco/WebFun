import noMovement from "./no-movement";
import { Point } from "src/util";
import { Monster, Zone } from "src/engine/objects";
import { Engine } from "src/engine";
import performMove from "./perform-move";
import isDoorway from "./is-doorway";

export default (direction: Point, monster: Monster, zone: Zone, engine: Engine, mover = performMove) => {
	const target = monster.position.byAdding(direction);
	if (!zone.bounds.contains(target)) {
		return noMovement(monster, zone, engine, mover);
	}

	if (zone.getTile(target.x, target.y, Zone.Layer.Object)) {
		return noMovement(monster, zone, engine, mover);
	}

	const move = !isDoorway(zone, target);
	if (move) {
		monster.position.add(direction);
	} else {
		direction = new Point(0, 0);
	}

	return mover(monster, direction, move, zone, engine);
};
