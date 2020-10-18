import { Monster, Zone } from "../objects";
import { performMove } from "./helpers";
import { Engine } from "src/engine";

export default (monster: Monster, zone: Zone, engine: Engine): void => {
	const hero = engine.hero.location;
	const directionToHero = hero.comparedTo(monster.position);
	monster.flag34 = true;
	return performMove(monster, directionToHero, false, zone, engine);
};
