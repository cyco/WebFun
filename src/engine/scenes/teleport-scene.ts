import MapScene from "./map-scene";
import TransitionScene from "./transition-scene";
import ZoneScene from "./zone-scene";
import { HotspotType, Zone } from "src/engine/objects";
import { Point } from "src/util";

class TeleportScene extends MapScene {
	protected isZoneConsideredSolved(zone: Zone): boolean {
		if (!zone.hasTeleporter) return super.isZoneConsideredSolved(zone);

		return zone.hotspots.withType(HotspotType.Teleporter).some(htsp => htsp.enabled);
	}

	protected handleMouseDown(_: Point, zone: Zone) {
		const engine = this.engine;
		this.exitScene();

		const target = zone.hotspots.withType(HotspotType.Teleporter).find(htsp => htsp.enabled);
		if (!target) return;

		const scene = new TransitionScene();
		scene.type = TransitionScene.Type.Room;
		scene.destinationHeroLocation = target.location;
		scene.destinationZone = zone;
		scene.scene = engine.sceneManager.currentScene as ZoneScene;
		scene.destinationWorld = engine.currentWorld;
		scene.destinationZoneLocation = engine.currentWorld.locationOfZone(zone);
		engine.sceneManager.pushScene(scene);
	}
}

export default TeleportScene;
