import { NPC, Zone } from "../objects";
import { Point } from "src/util";
import {
	noMovement,
	canPerformMeleeAttack,
	performMoveAfterDoorwayCheck,
	performMeleeAttack,
	even
} from "./helpers";
import { Engine } from "src/engine";

export default (npc: NPC, zone: Zone, engine: Engine) => {
	const tickCount = engine.metronome.tickCount;
	const hero = engine.hero.location;

	let direction: Point;
	// TODO: v95 = (char *)npc_1 + 8 * npc_1.facingDirection;
	const someX = 0; // TODO: x_11 = *((_DWORD *)v95 + 18);
	const someY = 0; // TODO: y14 = *((_DWORD *)v95 + 19);
	if (npc.cooldown) {
		npc.cooldown--;
		return noMovement(npc, zone, engine);
	}
	if (even(tickCount)) return noMovement(npc, zone, engine);
	if (someX === npc.x) direction.x = 0;
	else direction.x = someX <= npc.x ? -1 : 1;
	if (someY === npc.y) direction.y = 0;
	else direction.y = someY <= npc.y ? -1 : 1;
	if (!direction.x && !direction.y) {
		npc.facingDirection++;
		if (npc.facingDirection > 2) npc.facingDirection = -1;
	}
	if (canPerformMeleeAttack(direction, npc, hero)) {
		performMeleeAttack(npc, engine);
		return noMovement(npc, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, npc, zone, engine);
};
