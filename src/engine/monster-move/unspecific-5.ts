import { Monster, Zone } from "../objects";
import { Point, randmod } from "src/util";

import {
	evade,
	noMovement,
	canPerformMeleeAttack,
	performMoveAfterDoorwayCheck,
	moveCheck,
	convertToDirectionPoint,
	MoveCheckResult,
	performMeleeAttack
} from "./helpers";
import { Engine } from "src/engine";

export default (monster: Monster, zone: Zone, engine: Engine) => {
	if (monster.cooldown) {
		monster.cooldown--;
		return noMovement(monster, zone, engine);
	}
	if (!randmod(2)) return noMovement(monster, zone, engine);

	let direction: Point;
	const hero = engine.hero.location;
	const distanceToHero = monster.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(monster.position);

	if (distanceToHero.x >= 2 || distanceToHero.y >= 2) {
		direction = convertToDirectionPoint(monster.preferredDirection);
		if (moveCheck(monster.position, direction, zone, false, engine) !== MoveCheckResult.Free) {
			direction = new Point(0, 0);
			monster.cooldown = randmod(8);
			monster.preferredDirection = randmod(4) - 1;
		}
	} else {
		direction = directionToHero;
		direction = evade(direction, moveCheck(monster.position, direction, zone, false, engine));
	}

	if (canPerformMeleeAttack(direction, monster, hero)) {
		performMeleeAttack(monster, engine);
		return noMovement(monster, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, monster, zone, engine);
};
