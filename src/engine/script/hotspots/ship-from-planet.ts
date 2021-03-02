import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, hotspot: Hotspot): HotspotExecutionResult => {
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");

	const destinationZone = engine.assets.get(Zone, hotspot.arg);
	const destinationHotspot = destinationZone.hotspots.withType(Hotspot.Type.ShipToPlanet).first();
	const location = engine.dagobah.findLocationOfZone(destinationZone);
	console.assert(destinationHotspot !== null, "Zone does not have a proper target spot");
	console.assert(location !== null, "ShipFromPlanet destination must not be on main world!");
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);

	if (engine.sceneManager.currentScene instanceof RoomTransitionScene) {
		engine.sceneManager.popScene();
	}

	const scene = new RoomTransitionScene();
	scene.destinationHeroLocation = new Point(destinationHotspot.x, destinationHotspot.y);
	scene.destinationZone = destinationZone;
	scene.scene = engine.sceneManager.currentScene as ZoneScene;
	scene.destinationWorld = engine.dagobah;
	scene.destinationSector = location;
	engine.sceneManager.pushScene(scene);

	return HotspotExecutionResult.ChangeZone;
};
