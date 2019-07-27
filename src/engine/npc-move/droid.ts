import { NPC, Zone } from "../objects";
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

export default (npc: NPC, zone: Zone, engine: Engine) => {
	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(npc.position);

	let direction: Point;
	if (npc.cooldown) {
		npc.cooldown--;
		return noMovement(npc, zone, engine);
	}

	let canEvade = false;
	if (distanceToHero.x >= 2 || distanceToHero.y >= 2) {
		if (randmod(3)) {
			canEvade = false;
			direction = convertToDirectionPoint(npc.preferredDirection);
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
		direction = evade(direction, moveCheck(npc.position, direction, zone, false));
	} else if (moveCheck(npc.position, direction, zone, false) !== MoveCheckResult.Free) {
		direction = new Point(0, 0);
		npc.cooldown = randmod(10);
		npc.preferredDirection = randmod(4) - 1;
	}

	if (canPerformMeleeAttack(direction, npc, hero)) {
		performMeleeAttackIfUnarmed(!randmod(2), npc, engine);
		return noMovement(npc, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, npc, zone, engine);
};
