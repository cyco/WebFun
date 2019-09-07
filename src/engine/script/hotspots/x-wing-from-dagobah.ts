import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");

	const destinationZone = engine.assetManager.get(Zone, hotspot.arg);
	const otherHotspot = destinationZone.hotspots.find(({ type }) => type === Hotspot.Type.xWingToDagobah);
	console.assert(otherHotspot !== null);
	const scene = new RoomTransitionScene();
	scene.destinationHeroLocation = new Point(otherHotspot.x, otherHotspot.y);
	scene.destinationZone = destinationZone;
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
	scene.scene = engine.sceneManager.currentScene as ZoneScene;

	const location = engine.world.locationOfZone(destinationZone);
	console.assert(location !== null, "X-Wing destination must be on the main world!");
	scene.destinationWorld = engine.world;
	scene.destinationZoneLocation = location;
	engine.sceneManager.pushScene(scene);
	engine.temporaryState.enteredByPlane = true;
	return true;
};
