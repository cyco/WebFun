import { NPC, Zone } from "../objects";
import { Point, Size } from "src/util";
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

export default (npc: NPC, zone: Zone, engine: Engine) => {
	let direction: Point;
	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero
		.bySubtracting(npc.position)
		.dividedBy(new Size(distanceToHero.x, distanceToHero.y));
	directionToHero.x |= 0;
	directionToHero.y |= 0;
	const directionAwayFromHero = directionToHero.byScalingBy(-1);

	if (distanceToHero.x < 6 && distanceToHero.y < 6) {
		direction = directionAwayFromHero;
	} else direction = randomDirection();

	while (1) {
		direction = evade(direction, moveCheck(npc.position, direction, zone, false));
		if (canPerformMeleeAttack(direction, npc, hero)) {
			performMeleeAttack(npc, engine);
			return noMovement(npc, zone, engine);
		}

		const target = direction.byAdding(npc.position);
		if (zone.getTile(target.x, target.y, Zone.Layer.Object)) return noMovement(npc, zone, engine);

		if (!isDoorway(zone, target)) {
			npc.position.add(direction);
			return performMove(npc, direction, true, zone, engine);
		}

		direction = randomDirection();
	}
};
