import { Monster, Zone, Sound } from "../objects";
import { Point } from "src/util";
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

export default (monster: Monster, zone: Zone, engine: Engine) => {
	if (monster.cooldown) {
		monster.cooldown--;
		return noMovement(monster, zone, engine);
	}

	const tickCount = engine.metronome.tickCount;
	if (tickCount % 3) return noMovement(monster, zone, engine);

	if (!monster.currentActionFrame) {
		monster.currentActionFrame = tickCount % 10 ? 0 : 1;
	}

	const hero = engine.hero.location;
	const distanceToHero = monster.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(monster.position);
	const directionAwayFromHero = directionToHero.byScalingBy(-1);

	let direction: Point;
	if (monster.currentActionFrame) direction = directionToHero;
	else direction = directionAwayFromHero;

	if (distanceToHero.x < 6 && distanceToHero.y < 6) {
		direction = randomDirection();
	}

	direction = evade(direction, moveCheck(monster.position, direction, zone, false, engine));
	if (canPerformMeleeAttack(direction, monster, hero)) {
		if (monster.face.reference < 0 && monster.face.damage >= 0) {
			if (!(tickCount % 3))
				// only play sound sometimes
				playSound(engine.assets.get(Sound, engine.type.sounds.Hurt), engine);
			engine.hero.changeHealth(-monster.face.damage);
		}

		monster.currentActionFrame++;
		monster.currentActionFrame %= 5;
		return noMovement(monster, zone, engine);
	}

	return performMoveAfterDoorwayCheck(direction, monster, zone, engine);
};
