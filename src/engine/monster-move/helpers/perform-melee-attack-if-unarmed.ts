import playSound from "./play-sound";
import { Monster, Sound } from "src/engine/objects";
import { Engine } from "src/engine";

export default (hit: boolean, monster: Monster, engine: Engine): void => {
	if (monster.face.reference < 0 && monster.face.damage >= 0 && hit) {
		playSound(engine.assets.get(Sound, engine.variant.sounds.Hurt), engine);
		engine.hero.changeHealth(-monster.face.damage);
	}
};
