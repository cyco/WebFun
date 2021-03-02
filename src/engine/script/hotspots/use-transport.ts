import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, htsp: Hotspot): HotspotExecutionResult => {
	const counterPart =
		htsp.type === Hotspot.Type.VehicleTo ? Hotspot.Type.VehicleBack : Hotspot.Type.VehicleTo;
	const destinationZone = engine.assets.get(Zone, htsp.arg);
	const worldLocation = engine.currentWorld.findLocationOfZone(destinationZone);
	const sector = destinationZone.hotspots.withType(counterPart).first().location;

	if (engine.sceneManager.currentScene instanceof RoomTransitionScene) {
		engine.sceneManager.popScene();
	}

	const transitionScene = new RoomTransitionScene();
	transitionScene.destinationHeroLocation = sector;
	transitionScene.destinationZone = destinationZone;
	transitionScene.scene = engine.sceneManager.currentScene as ZoneScene;
	transitionScene.destinationWorld = engine.currentWorld;
	transitionScene.destinationSector = worldLocation;
	engine.sceneManager.pushScene(transitionScene);

	return HotspotExecutionResult.ChangeZone;
};
