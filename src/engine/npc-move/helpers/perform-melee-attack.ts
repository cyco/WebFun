import playSound from "./play-sound";
import { NPC, Sound } from "src/engine/objects";
import { Engine } from "src/engine";
import dealDamage from "./deal-damage";

export default (npc: NPC, engine: Engine) => {
	if (npc.face.damage >= 0) {
		playSound(engine.assetManager.get(Sound, engine.type.sounds.Hurt), engine);
		dealDamage(npc.face.damage, engine);
	}
};
