import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, hotspot: Hotspot): HotspotExecutionResult => {
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);

	const zone = engine.currentZone;
	const destinationZone = engine.assets.get(Zone, hotspot.arg);
	const { world, location } = engine.findLocationOfZone(destinationZone);

	if (engine.sceneManager.currentScene instanceof RoomTransitionScene) {
		engine.sceneManager.popScene();
	}

	const scene = new RoomTransitionScene();
	scene.destinationHeroLocation = zone.doorInLocation;
	scene.destinationZone = destinationZone;
	scene.scene = engine.sceneManager.currentScene as ZoneScene;
	scene.destinationWorld = world;
	scene.destinationZoneLocation = location;
	engine.sceneManager.pushScene(scene);

	return HotspotExecutionResult.ChangeZone;
};
