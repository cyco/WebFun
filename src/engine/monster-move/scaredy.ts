import { Monster, Zone } from "../objects";
import { Point } from "src/util";
import randomDirection from "./helpers/random-direction";
import {
	evade,
	noMovement,
	canPerformMeleeAttack,
	moveCheck,
	performMeleeAttack,
	performMove,
	isDoorway
} from "./helpers";
import { Engine } from "src/engine";

export default (monster: Monster, zone: Zone, engine: Engine): void => {
	let direction: Point;
	const hero = engine.hero.location;
	const distanceToHero = monster.position.bySubtracting(hero).abs();
	const directionToHero = hero.comparedTo(monster.position);
	const directionAwayFromHero = directionToHero.byScalingBy(-1);

	if (distanceToHero.x < 6 && distanceToHero.y < 6) {
		direction = directionAwayFromHero;
	} else direction = randomDirection();

	while (true) {
		direction = evade(direction, moveCheck(monster.position, direction, zone, false, engine));
		if (canPerformMeleeAttack(direction, monster, hero)) {
			performMeleeAttack(monster, engine);
			return noMovement(monster, zone, engine);
		}

		const target = direction.byAdding(monster.position);
		if (zone.getTile(target.x, target.y, Zone.Layer.Object))
			return noMovement(monster, zone, engine);

		if (!isDoorway(zone, target)) {
			monster.position.add(direction);
			return performMove(monster, direction, true, zone, engine);
		}

		direction = randomDirection();
	}
};
