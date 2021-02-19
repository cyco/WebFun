import MapScene from "./map-scene";
import RoomTransitionScene from "./room-transition-scene";
import ZoneScene from "./zone-scene";
import { Hotspot, Zone } from "src/engine/objects";
import { Point } from "src/util";

class TeleportScene extends MapScene {
	protected isZoneConsideredSolved(zone: Zone): boolean {
		if (!zone.hasTeleporter) return super.isZoneConsideredSolved(zone);

		return zone.hotspots.withType(Hotspot.Type.Teleporter).some(htsp => htsp.enabled);
	}

	protected handleMouseDown(_: Point, zone: Zone): void {
		const engine = this.engine;
		this.exitScene();

		const target = zone.hotspots.withType(Hotspot.Type.Teleporter).find(htsp => htsp.enabled);
		if (!target) return;

		if (engine.sceneManager.currentScene instanceof RoomTransitionScene) {
			engine.sceneManager.popScene();
		}

		const scene = new RoomTransitionScene();
		scene.destinationHeroLocation = target.location;
		scene.destinationZone = zone;
		scene.scene = engine.sceneManager.currentScene as ZoneScene;
		scene.destinationWorld = engine.currentWorld;
		scene.destinationSector = engine.currentWorld.findLocationOfZone(zone);
		engine.sceneManager.pushScene(scene);
	}
}

export default TeleportScene;
