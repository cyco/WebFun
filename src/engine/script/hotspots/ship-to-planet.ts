import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, hotspot: Hotspot): HotspotExecutionResult => {
	console.assert(hotspot.argument !== -1, "This is not where we're coming from!");

	const destinationZone = engine.assets.get(Zone, hotspot.argument);
	const otherHotspot = destinationZone.hotspots.find(
		({ type }) => type === Hotspot.Type.ShipFromPlanet
	);
	console.assert(otherHotspot !== null);
	const scene = new RoomTransitionScene();
	scene.destinationHeroLocation = new Point(otherHotspot.x, otherHotspot.y);
	scene.destinationZone = destinationZone;
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
	scene.scene = engine.sceneManager.currentScene as ZoneScene;

	if (engine.sceneManager.currentScene instanceof RoomTransitionScene) {
		engine.sceneManager.popScene();
	}

	const location = engine.world.findLocationOfZone(destinationZone);
	console.assert(location !== null, "ShipToPlanet destination must be on the main world!");
	scene.destinationWorld = engine.world;
	scene.destinationSector = location;
	engine.sceneManager.pushScene(scene);

	return HotspotExecutionResult.ChangeZone;
};
