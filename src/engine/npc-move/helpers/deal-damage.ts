import { Engine } from "src/engine";

export default (damage: number, engine: Engine) => {
	engine.hero.health -= damage;
};
