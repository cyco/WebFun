import { Engine } from "src/engine";
import { Hotspot, HotspotType, Zone } from "src/engine/objects";
import { TransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";
import { NullIfMissing } from "src/engine/asset-manager";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	const zone = engine.currentZone;
	const targetZone = engine.assetManager.get(Zone, hotspot.arg, NullIfMissing);
	const waysOut = targetZone.hotspots.filter((h: Hotspot) => h.type === HotspotType.DoorOut);
	console.assert(waysOut.length === 1, "Found multiple doors out");

	const scene = new TransitionScene();
	scene.type = TransitionScene.Type.Room;
	scene.targetHeroLocation = new Point(waysOut.first().x, waysOut.first().y);
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

	targetZone.hotspots
		.filter((hotspot: Hotspot) => {
			return hotspot.type === HotspotType.DoorOut && hotspot.arg === -1;
		})
		.forEach((hotspot: Hotspot) => (hotspot.arg = zone.id));
	scene.targetZoneLocation = location;
	engine.sceneManager.pushScene(scene);
	return true;
};
