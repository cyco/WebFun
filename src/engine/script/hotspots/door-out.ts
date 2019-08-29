import { Engine } from "src/engine";
import { Hotspot, Zone, HotspotType } from "src/engine/objects";
import { TransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	const zone = engine.currentZone;
	console.assert(hotspot.arg !== -1, "This is not where we're coming from!");

	zone.hotspots.filter(({ type }) => type === HotspotType.DoorOut).forEach(hotspot => (hotspot.arg = -1));

	const targetZone = engine.assetManager.get(Zone, hotspot.arg);
	const waysIn = targetZone.hotspots.filter(
		({ type, enabled, arg }) => type === HotspotType.DoorIn && arg === zone.id && enabled
	);
	console.assert(waysIn.length < 2, "Found multiple doors we might have come through!");
	console.assert(waysIn.length > 0, "Found no active door to return to zone");

	const scene = new TransitionScene();
	scene.type = TransitionScene.Type.Room;
	scene.targetHeroLocation = new Point(waysIn.first().x, waysIn.first().y);
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
