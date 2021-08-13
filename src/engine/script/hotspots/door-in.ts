import { Engine } from "src/engine";
import { Hotspot, Zone } from "src/engine/objects";
import { RoomTransitionScene, ZoneScene } from "src/engine/scenes";
import { Point } from "src/util";
import { NullIfMissing } from "src/engine/asset-manager";
import { HotspotExecutionResult } from "../hotspot-execution-result";

export default (engine: Engine, hotspot: Hotspot): HotspotExecutionResult => {
	console.assert(engine.sceneManager.currentScene instanceof ZoneScene);
	const zone = engine.currentZone;
	const destinationZone = engine.assets.get(Zone, hotspot.argument, NullIfMissing);
	const doorOut = destinationZone.hotspots.find(
		(h: Hotspot) => h.type === Hotspot.Type.DoorOut && (h.argument === -1 || h.argument === zone.id)
	);
	console.assert(!!doorOut, "Found no way to return to current zone");

	const { world, location } = engine.findLocationOfZone(destinationZone);

	destinationZone.doorInLocation = hotspot.location;
	doorOut.argument = zone.id;

	if (engine.sceneManager.currentScene instanceof RoomTransitionScene) {
		engine.sceneManager.popScene();
	}

	const scene = new RoomTransitionScene();
	scene.destinationHeroLocation = new Point(doorOut.x, doorOut.y);
	scene.destinationZone = destinationZone;
	scene.scene = engine.sceneManager.currentScene as ZoneScene;
	scene.destinationWorld = world;
	scene.destinationSector = location;
	engine.sceneManager.pushScene(scene);

	return HotspotExecutionResult.ChangeZone;
};
