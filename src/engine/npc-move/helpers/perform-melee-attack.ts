import playSound from "./play-sound";
import { NPC, Sound } from "src/engine/objects";
import { Engine } from "src/engine";

export default (npc: NPC, engine: Engine) => {
	if (npc.face.damage >= 0) {
		playSound(engine.assets.get(Sound, engine.type.sounds.Hurt), engine);
		engine.hero.changeHealth(-npc.face.damage);
	}
};
