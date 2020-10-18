import playSound from "./play-sound";
import { Monster, Sound } from "src/engine/objects";
import { Engine } from "src/engine";

export default (monster: Monster, engine: Engine): void => {
	if (monster.face.damage >= 0) {
		playSound(engine.assets.get(Sound, engine.type.sounds.Hurt), engine);
		engine.hero.changeHealth(-monster.face.damage);
	}
};
