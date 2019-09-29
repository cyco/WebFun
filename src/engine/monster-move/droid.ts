import { Monster, Zone } from "../objects";
import { Point, randmod } from "src/util";
import randomDirection from "./helpers/random-direction";
import {
	evade,
	noMovement,
	canPerformMeleeAttack,
	performMoveAfterDoorwayCheck,
	moveCheck,
	MoveCheckResult,
	performMeleeAttackIfUnarmed,
	convertToDirectionPoint
} from "./helpers";
import { Engine } from "src/engine";

export default (monster: Monster, zone: Zone, engine: Engine) => {
	const hero = engine.hero.location;
	const distanceToHero = monster.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(monster.position);

	let direction: Point;
	if (monster.cooldown) {
		monster.cooldown--;
		return noMovement(monster, zone, engine);
	}

	let canEvade = false;
	if (distanceToHero.x >= 2 || distanceToHero.y >= 2) {
		if (randmod(3)) {
			canEvade = false;
			direction = convertToDirectionPoint(monster.preferredDirection);
		} else {
			direction = randomDirection();
			canEvade = true;
		}
	} else {
		canEvade = true;
		if (randmod(2)) {
			direction = directionToHero;
		} else {
			direction = randomDirection();
		}
	}
	if (canEvade) {
		direction = evade(direction, moveCheck(monster.position, direction, zone, false));
	} else if (moveCheck(monster.position, direction, zone, false) !== MoveCheckResult.Free) {
		direction = new Point(0, 0);
		monster.cooldown = randmod(10);
		monster.preferredDirection = randmod(4) - 1;
	}

	if (canPerformMeleeAttack(direction, monster, hero)) {
		performMeleeAttackIfUnarmed(!randmod(2), monster, engine);
		return noMovement(monster, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, monster, zone, engine);
};
