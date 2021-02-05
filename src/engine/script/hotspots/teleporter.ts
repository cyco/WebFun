import { Engine } from "src/engine";
import { Hotspot, Tile } from "src/engine/objects";
import { TeleportScene } from "src/engine/scenes";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, _: Hotspot): HotspotExecutionResult => {
	if (!engine.inventory.find(tile => tile.hasAttributes(Tile.Attributes.Map))) {
		return HotspotExecutionResult.Void;
	}

	const scene = new TeleportScene();
	engine.sceneManager.pushScene(scene);
	return HotspotExecutionResult.ChangeZone;
};
