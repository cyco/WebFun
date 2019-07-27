import { NPC, Zone } from "../objects";
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

export default (npc: NPC, zone: Zone, engine: Engine) => {
	let direction: Point;

	if (npc.cooldown) {
		npc.cooldown--;
		return noMovement(npc, zone, engine);
	}
	if (!randmod(2)) return noMovement(npc, zone, engine);

	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(npc.position);
	directionToHero.x |= 0;
	directionToHero.y |= 0;

	if (distanceToHero.x >= 2 || distanceToHero.y >= 2) {
		direction = convertToDirectionPoint(npc.preferredDirection);
	} else if (randmod(2)) {
		direction = directionToHero;
		direction = evade(direction, moveCheck(npc.position, direction, zone, false));
	} else {
		direction = randomDirection();
	}

	if (moveCheck(npc.position, direction, zone, false) !== MoveCheckResult.Free) {
		direction = new Point(0, 0);
		npc.cooldown = randmod(3);
		npc.preferredDirection = randmod(4) - 1;
	}

	if (canPerformMeleeAttack(direction, npc, hero)) {
		performMeleeAttack(npc, engine);
		return noMovement(npc, zone, engine);
	}
	return performMoveAfterDoorwayCheck(direction, npc, zone, engine);
};
