import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	const zone = engine.currentZone;
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");
	const destinationZone = engine.assetManager.get(Zone, hotspot.arg);
	const doorIn = destinationZone.hotspots.find(
		({ type, arg }) => type === Hotspot.Type.DoorIn && arg === zone.id
	);
	console.assert(!!doorIn, "Don't know where to return to in target zone");

	const scene = new RoomTransitionScene();
	scene.destinationHeroLocation = new Point(doorIn.x, doorIn.y);
	scene.destinationZone = destinationZone;
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
	scene.scene = engine.sceneManager.currentScene as ZoneScene;

	let world = engine.dagobah;
	let location = world.locationOfZone(destinationZone);
	if (!location) {
		world = engine.world;
		location = world.locationOfZone(destinationZone);
	}
	scene.destinationWorld = world;
	scene.destinationZoneLocation = location;
	engine.sceneManager.pushScene(scene);

	return true;
};
