import { Engine } from "src/engine";
import { Yoda } from "src/engine/type";
import { Hotspot } from "src/engine/objects";
import { TeleportScene } from "src/engine/scenes";

export default (engine: Engine, _: Hotspot): boolean => {
	if (!engine.inventory.contains(Yoda.tileIDs.Locator)) return false;

	const scene = new TeleportScene();
	engine.sceneManager.pushScene(scene);
	return true;
};
