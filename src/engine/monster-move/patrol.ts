import { Monster, Zone } from "../objects";
import {
	noMovement,
	canPerformMeleeAttack,
	performMoveAfterDoorwayCheck,
	performMeleeAttack,
	even
} from "./helpers";
import { Engine } from "src/engine";

export default (monster: Monster, zone: Zone, engine: Engine) => {
	const tickCount = engine.metronome.tickCount;
	const hero = engine.hero.location;

	const waypoint = monster.waypoints[monster.facingDirection + 1];
	if (monster.cooldown) {
		monster.cooldown--;
		return noMovement(monster, zone, engine);
	}
	if (even(tickCount)) return noMovement(monster, zone, engine);
	const direction = waypoint.comparedTo(monster.position);

	if (!direction.x && !direction.y) {
		monster.facingDirection++;
		if (monster.facingDirection > 2) monster.facingDirection = -1;
	}

	if (canPerformMeleeAttack(direction, monster, hero)) {
		performMeleeAttack(monster, engine);
		return noMovement(monster, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, monster, zone, engine);
};
