import { NPC, Zone, Sound } from "../objects";
import { Point, randmod } from "src/util";
import randomDirection from "./helpers/random-direction";
import {
	evade,
	noMovement,
	playSound,
	canPerformMeleeAttack,
	performMoveAfterDoorwayCheck,
	moveCheck
} from "./helpers";
import { Engine } from "src/engine";

export default (npc: NPC, zone: Zone, engine: Engine) => {
	let direction: Point;
	if (npc.cooldown) {
		npc.cooldown--;
		return noMovement(npc, zone, engine);
	}

	if (!randmod(2)) {
		return noMovement(npc, zone, engine);
	}

	const hero = engine.hero.location;
	const directionToHero = hero.comparedTo(npc.position);
	const directionAwayFromHero = directionToHero.byScalingBy(-1);

	if (npc.flag1c) {
		if (randmod(2)) {
			direction = randomDirection();
		} else {
			direction = directionAwayFromHero;
		}
		npc.currentFrame++;
		if (npc.currentFrame > 3) {
			npc.flag1c = false;
			npc.currentFrame = 0;
		}
	} else {
		direction = directionToHero;
	}

	direction = evade(direction, moveCheck(npc.position, direction, zone, false));
	if (canPerformMeleeAttack(direction, npc, hero)) {
		direction = new Point(0, 0);
		if (npc.face.damage >= 0) {
			playSound(engine.assets.get(Sound, engine.type.sounds.Hurt), engine);
			engine.hero.changeHealth(-npc.face.damage);
		}
		npc.currentFrame++;
		if (npc.currentFrame > 1) {
			npc.flag1c = true;
			npc.currentFrame = 0;
		}
	}

	if (!npc.flag1c) {
		npc.currentFrame++;
		if (npc.currentFrame >= 15) {
			npc.flag1c = true;
			npc.currentFrame = 0;
		}
	}

	return performMoveAfterDoorwayCheck(direction, npc, zone, engine);
};
