import { NPC, Zone } from "../objects";
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

	const waypoint = npc.waypoints[npc.facingDirection + 1];
	if (npc.cooldown) {
		npc.cooldown--;
		return noMovement(npc, zone, engine);
	}
	if (even(tickCount)) return noMovement(npc, zone, engine);
	const direction = waypoint.comparedTo(npc.position);

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
