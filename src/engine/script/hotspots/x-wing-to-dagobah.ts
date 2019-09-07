import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");

	const destinationZone = engine.assetManager.get(Zone, hotspot.arg);
	const desinationHotspot = destinationZone.hotspots.withType(Hotspot.Type.xWingFromDagobah).first();
	const location = engine.dagobah.locationOfZone(destinationZone);
	console.assert(desinationHotspot !== null, "Zone does not have a proper target spot");
	console.assert(location !== null, "X-Wing destination must be on dagobah!");
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);

	const scene = new RoomTransitionScene();
	scene.destinationHeroLocation = new Point(desinationHotspot.x, desinationHotspot.y);
	scene.destinationZone = destinationZone;
	scene.scene = engine.sceneManager.currentScene as ZoneScene;
	scene.destinationWorld = engine.dagobah;
	scene.destinationZoneLocation = location;
	engine.sceneManager.pushScene(scene);
	engine.temporaryState.enteredByPlane = true;
	return true;
};
