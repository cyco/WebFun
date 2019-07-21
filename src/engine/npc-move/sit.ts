import { NPC, Zone } from "../objects";
import { Size } from "src/util";
import { performMove } from "./helpers";
import { Engine } from "src/engine";

export default (npc: NPC, zone: Zone, engine: Engine) => {
	const hero = engine.hero.location;
	const distanceToHero = npc.position.bySubtracting(hero).abs();
	const directionToHero = hero
		.bySubtracting(npc.position)
		.dividedBy(new Size(distanceToHero.x, distanceToHero.y));
	directionToHero.x |= 0;
	directionToHero.y |= 0;
	npc.flag34 = true;
	return performMove(npc, directionToHero, false, zone, engine);
};
