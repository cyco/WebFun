import { Monster, Zone, Sound } from "../objects";
import { Point, randmod } from "src/util";
import randomDirection from "./helpers/random-direction";
import { evade, noMovement, playSound, canPerformMeleeAttack, performMoveAfterDoorwayCheck, moveCheck } from "./helpers";
import { Engine } from "src/engine";

export default (monster: Monster, zone: Zone, engine: Engine): void => {
	let direction: Point;
	if (monster.cooldown) {
		monster.cooldown--;
		return noMovement(monster, zone, engine);
	}

	if (!randmod(2)) {
		return noMovement(monster, zone, engine);
	}

	const hero = engine.hero.location;
	const directionToHero = hero.comparedTo(monster.position);
	const directionAwayFromHero = directionToHero.byScalingBy(-1);

	if (monster.flag1c) {
		if (randmod(2)) {
			direction = randomDirection();
		} else {
			direction = directionAwayFromHero;
		}
		monster.currentFrame++;
		if (monster.currentFrame > 3) {
			monster.flag1c = false;
			monster.currentFrame = 0;
		}
	} else {
		direction = directionToHero;
	}

	direction = evade(direction, moveCheck(monster.position, direction, zone, false, engine));
	if (canPerformMeleeAttack(direction, monster, hero)) {
		direction = new Point(0, 0);
		if (monster.face.damage >= 0) {
			playSound(engine.assets.get(Sound, engine.type.sounds.Hurt), engine);
			engine.hero.changeHealth(-monster.face.damage);
		}
		monster.currentFrame++;
		if (monster.currentFrame > 1) {
			monster.flag1c = true;
			monster.currentFrame = 0;
		}
	}

	if (!monster.flag1c) {
		monster.currentFrame++;
		if (monster.currentFrame >= 15) {
			monster.flag1c = true;
			monster.currentFrame = 0;
		}
	}

	return performMoveAfterDoorwayCheck(direction, monster, zone, engine);
};
