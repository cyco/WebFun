import { NPC, Zone } from "../objects";
import { performMove } from "./helpers";
import { Engine } from "src/engine";

export default (npc: NPC, zone: Zone, engine: Engine) => {
	const hero = engine.hero.location;
	const directionToHero = hero.comparedTo(npc.position);
	npc.flag34 = true;
	return performMove(npc, directionToHero, false, zone, engine);
};
