import { Engine } from "src/engine";
import { Hotspot, HotspotType, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";
import { NullIfMissing } from "src/engine/asset-manager";

export default (engine: Engine, hotspot: Hotspot): boolean => {
	const zone = engine.currentZone;
	const destinationZone = engine.assetManager.get(Zone, hotspot.arg, NullIfMissing);
	const wayOut = destinationZone.hotspots.find(
		(h: Hotspot) => h.type === HotspotType.DoorOut && (h.arg === -1 || h.arg === zone.id)
	);
	console.assert(!!wayOut, "Found no way to return to current zone");

	const scene = new RoomTransitionScene();
	scene.destinationHeroLocation = new Point(wayOut.x, wayOut.y);
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

	wayOut.arg = zone.id;
	scene.destinationZoneLocation = location;
	engine.sceneManager.pushScene(scene);
	return true;
};
