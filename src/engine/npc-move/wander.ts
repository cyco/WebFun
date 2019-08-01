import { NPC, Zone } from "../objects";
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

export default (npc: NPC, zone: Zone, engine: Engine) => {
	const tickCount = engine.metronome.tickCount;

	if (npc.cooldown) {
		npc.cooldown--;
		return noMovement(npc, zone, engine);
	}
	if (even(tickCount)) return noMovement(npc, zone, engine);

	let direction = convertToDirectionPoint(npc.preferredDirection);

	const hero = engine.hero.location;
	if (moveCheck(npc.position, direction, zone, false) !== MoveCheckResult.Free) {
		direction = new Point(0, 0);
		npc.cooldown = randmod(3);
		npc.preferredDirection = randmod(4) - 1;
	}
	if (canPerformMeleeAttack(direction, npc, hero)) {
		performMeleeAttackIfUnarmed(true, npc, engine);
		return noMovement(npc, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, npc, zone, engine);
};
