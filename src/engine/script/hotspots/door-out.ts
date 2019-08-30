import { Engine } from "src/engine";
import { Hotspot, Zone, HotspotType } from "src/engine/objects";
import { TransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	const zone = engine.currentZone;
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");
	const targetZone = engine.assetManager.get(Zone, hotspot.arg);
	const doorIn = targetZone.hotspots.find(
		({ type, arg }) => type === HotspotType.DoorIn && arg === zone.id
	);
	console.assert(!!doorIn, "Don't know where to return to in target zone");

	const scene = new TransitionScene();
	scene.type = TransitionScene.Type.Room;
	scene.targetHeroLocation = new Point(doorIn.x, doorIn.y);
	scene.targetZone = targetZone;
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
	scene.scene = engine.sceneManager.currentScene as ZoneScene;

	let world = engine.dagobah;
	let location = world.locationOfZone(targetZone);
	if (!location) {
		world = engine.world;
		location = world.locationOfZone(targetZone);
	}
	scene.targetWorld = world;
	scene.targetZoneLocation = location;
	engine.sceneManager.pushScene(scene);

	return true;
};
