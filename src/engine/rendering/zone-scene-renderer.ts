import { Tile, Zone } from "src/engine/objects";
import Settings from "src/settings";
import { rgba } from "src/util";
import Hotspot from "../objects/hotspot";
import AbstractRenderer from "../rendering/abstract-renderer";
import Engine from "src/engine/engine";

class ZoneSceneRenderer {
	public render(zone: Zone, engine: Engine, renderer: AbstractRenderer) {
		renderer.clear();

		const offset = engine.camera.offset;
		const hero = engine.hero;

		const size = zone.size;
		for (let z = 0; z < Zone.LAYERS; z++) {
			for (let y = 0; y < size.height; y++) {
				for (let x = 0; x < size.width; x++) {
					const tile = zone.getTile(x, y, z);
					if (tile) {
						renderer.renderZoneTile(tile, x + offset.x, y + offset.y, z);
					}
				}
			}

			if (z === 1) {
				if (hero.visible) hero.render(offset, renderer);
				else if (Settings.drawHeroTile && (<any>renderer).fillRect instanceof Function) {
					// always show hero while debugging
					(<any>renderer).fillRect(
						(hero.location.x + offset.x) * Tile.WIDTH,
						(hero.location.y + offset.y) * Tile.HEIGHT,
						Tile.WIDTH,
						Tile.HEIGHT,
						rgba(0, 0, 255, 0.3)
					);
				}

				zone.npcs.forEach(npc => {
					const tile = npc.face.frames[0].down;
					if (tile) {
						renderer.renderZoneTile(
							tile,
							npc.position.x + offset.x,
							npc.position.y + offset.y,
							z
						);
					}
				});
			}
		}

		// show hotspots while debugging
		if (Settings.drawHotspots && (<any>renderer).fillRect instanceof Function)
			zone.hotspots.forEach(
				(h: Hotspot): void => {
					(<any>renderer).fillRect(
						(h.x + offset.x) * Tile.WIDTH,
						(h.y + offset.y) * Tile.HEIGHT,
						Tile.WIDTH,
						Tile.HEIGHT,
						h.enabled ? rgba(0, 255, 0, 0.3) : rgba(255, 0, 0, 0.3)
					);
				}
			);
	}
}
export default ZoneSceneRenderer;
