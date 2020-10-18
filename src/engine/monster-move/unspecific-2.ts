import { Monster, Zone } from "../objects";
import { Point, randmod } from "src/util";
import randomDirection from "./helpers/random-direction";
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

export default (monster: Monster, zone: Zone, engine: Engine): void => {
	let direction: Point;

	if (monster.cooldown) {
		monster.cooldown--;
		return noMovement(monster, zone, engine);
	}
	if (!randmod(2)) return noMovement(monster, zone, engine);

	const hero = engine.hero.location;
	const distanceToHero = monster.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(monster.position);
	directionToHero.x |= 0;
	directionToHero.y |= 0;

	if (distanceToHero.x >= 2 || distanceToHero.y >= 2) {
		direction = convertToDirectionPoint(monster.preferredDirection);
	} else if (randmod(2)) {
		direction = directionToHero;
		direction = evade(direction, moveCheck(monster.position, direction, zone, false, engine));
	} else {
		direction = randomDirection();
	}

	if (moveCheck(monster.position, direction, zone, false, engine) !== MoveCheckResult.Free) {
		direction = new Point(0, 0);
		monster.cooldown = randmod(3);
		monster.preferredDirection = randmod(4) - 1;
	}

	if (canPerformMeleeAttack(direction, monster, hero)) {
		performMeleeAttack(monster, engine);
		return noMovement(monster, zone, engine);
	}
	return performMoveAfterDoorwayCheck(direction, monster, zone, engine);
};
