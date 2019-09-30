import { Engine } from "src/engine";
import { Yoda } from "src/engine/type";
import { Hotspot } from "src/engine/objects";
import { TeleportScene } from "src/engine/scenes";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, _: Hotspot): HotspotExecutionResult => {
	if (!engine.inventory.contains(Yoda.tileIDs.Locator)) return HotspotExecutionResult.Void;

	const scene = new TeleportScene();
	engine.sceneManager.pushScene(scene);
	return HotspotExecutionResult.ChangeZone;
};
