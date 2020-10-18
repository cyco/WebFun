import { Monster, Zone } from "../objects";
import { Point, randmod } from "src/util";
import {
	noMovement,
	canPerformMeleeAttack,
	performMoveAfterDoorwayCheck,
	moveCheck,
	convertToDirectionPoint,
	MoveCheckResult,
	even,
	performMeleeAttackIfUnarmed
} from "./helpers";
import { Engine } from "src/engine";

export default (monster: Monster, zone: Zone, engine: Engine): void => {
	const tickCount = engine.metronome.tickCount;

	if (monster.cooldown) {
		monster.cooldown--;
		return noMovement(monster, zone, engine);
	}
	if (even(tickCount)) return noMovement(monster, zone, engine);

	let direction = convertToDirectionPoint(monster.preferredDirection);

	const hero = engine.hero.location;
	if (moveCheck(monster.position, direction, zone, false, engine) !== MoveCheckResult.Free) {
		direction = new Point(0, 0);
		monster.cooldown = randmod(3);
		monster.preferredDirection = randmod(4) - 1;
	}
	if (canPerformMeleeAttack(direction, monster, hero)) {
		performMeleeAttackIfUnarmed(true, monster, engine);
		return noMovement(monster, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, monster, zone, engine);
};
