import { NPC, Zone, Sound } from "../objects";
import { Point, Size } from "src/util";
import randomDirection from "./helpers/random-direction";
import {
	evade,
	noMovement,
	playSound,
	changeHealth,
	canPerformMeleeAttack,
	performMoveAfterDoorwayCheck,
	moveCheck
} from "./helpers";
import { Engine } from "src/engine";

export default (npc: NPC, zone: Zone, engine: Engine) => {
	const tickCount = engine.metronome.tickCount;

	let direction: Point;
	if (npc.cooldown) {
		direction = new Point(0, 0);
		npc.cooldown--;
		return noMovement(npc, zone, engine);
	}

	if (tickCount % 3) return noMovement(npc, zone, engine);

	if (!npc.currentActionFrame) {
		npc.currentActionFrame = tickCount % 10 ? 0 : 1;
	}

	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero
		.bySubtracting(npc.position)
		.dividedBy(new Size(distanceToHero.x, distanceToHero.y));
	directionToHero.x |= 0;
	directionToHero.y |= 0;
	const directionAwayFromHero = directionToHero.byScalingBy(-1);
	if (npc.currentActionFrame) direction = directionToHero;
	else direction = directionAwayFromHero;

	if (distanceToHero.x < 6 && distanceToHero.y < 6) {
		direction = randomDirection();
	}

	direction = evade(direction, moveCheck(npc.position, direction, zone, false));
	if (canPerformMeleeAttack(direction, npc, hero)) {
		if (npc.face.reference < 0 && npc.face.damage >= 0) {
			if (!(tickCount % 3))
				// only play sound sometimes
				playSound(engine.assetManager.get(Sound, engine.type.sounds.Hurt), engine);
			changeHealth(npc.face.damage, engine);
		}

		npc.currentActionFrame++;
		npc.currentActionFrame %= 5;
		return noMovement(npc, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, npc, zone, engine);
};
