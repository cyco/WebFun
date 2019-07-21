import playSound from "./play-sound";
import changeHealth from "./change-health";
import { NPC, Sound } from "src/engine/objects";
import { Engine } from "src/engine";

export default (hit: boolean, npc: NPC, engine: Engine) => {
	if (npc.face.reference < 0 && npc.face.damage >= 0 && hit) {
		playSound(engine.assetManager.get(Sound, engine.type.sounds.Hurt), engine);
		changeHealth(npc.face.damage, engine);
	}
};
