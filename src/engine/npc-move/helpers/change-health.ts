import { Engine } from "src/engine";

export default (damage: number, engine: Engine): void => {
	engine.hero.health -= damage;
};
