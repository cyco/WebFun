import { Tile, Zone } from "src/engine/objects";
import Settings from "src/settings";
import { rgba } from "src/util";
import Hotspot from "../objects/hotspot";
import AbstractRenderer from "src/engine/rendering/abstract-renderer";
import ColorPalette from "src/engine/rendering/color-palette";
import Engine from "src/engine/engine";

class ZoneSceneRenderer {
	public render(zone: Zone, engine: Engine, renderer: AbstractRenderer, palette: ColorPalette) {
		renderer.clear();

		const offset = engine.camera.offset;
		const TileWidth = Tile.WIDTH;
		const TileHeight = Tile.HEIGHT;
		const ZoneLayers = Zone.LAYERS;
		const VisibleWidth = 9;
		const VisibleHeight = 9;

		const firstXTile = -offset.x;
		const firstYTile = -offset.y;
		const result = new ImageData(VisibleWidth * TileWidth, VisibleHeight * TileHeight);
		var buffer = new ArrayBuffer(result.data.length);
		var byteArray = new Uint8Array(buffer);
		var data = new Uint32Array(buffer);

		const hero = engine.hero;
		const bpr = VisibleWidth * TileWidth;
		let x, y, z, tx, ty;
		for (z = 0; z < ZoneLayers; z++) {
			for (y = 0; y < VisibleHeight; y++) {
				for (x = 0; x < VisibleWidth; x++) {
					const tile = zone.getTile(x + firstXTile, y + firstYTile, z);
					if (!tile) continue;

					const pixels = tile.imageData;
					let j = y * TileHeight * bpr + x * TileWidth;
					for (ty = 0; ty < TileHeight; ty++) {
						for (tx = 0; tx < TileWidth; tx++) {
							const i = ty * TileWidth + tx;
							const paletteIndex = pixels[i];
							if (paletteIndex === 0) continue;

							data[j + tx] = palette[paletteIndex];
						}
						j += bpr;
					}
				}
			}

			if (z === 1) {
				+(function() {
					if (hero.visible) {
						let appearance = hero._appearance;

						// TODO: implement appearance
						if (!appearance) return;
						let frame = hero._actionFrames;
						if ((hero as any)._attacking) {
							appearance = hero.weapon;
						}

						const tile = appearance.getFace(hero._direction, frame);
						if (tile) {
							const pixels = tile.imageData;
							let x = hero._location.x + offset.x;
							let y = hero._location.y + offset.y;
							if (x < 0 || x >= VisibleWidth) return;
							if (y < 0 || y >= VisibleHeight) return;
							let j = y * TileHeight * bpr + x * TileWidth;
							for (ty = 0; ty < TileHeight; ty++) {
								for (tx = 0; tx < TileWidth; tx++) {
									const i = ty * TileWidth + tx;
									const paletteIndex = pixels[i];
									if (paletteIndex === 0) continue;

									data[j + tx] = palette[paletteIndex];
								}
								j += bpr;
							}
						}
					}
				})();

				zone.npcs.forEach(npc => {
					const tile = npc.face.frames[0].down;
					if (!tile) return;

					const pixels = tile.imageData;
					let x = npc.position.x + offset.x;
					let y = npc.position.y + offset.y;
					if (x < 0 || x >= VisibleWidth) return;
					if (y < 0 || y >= VisibleHeight) return;

					let j = y * TileHeight * bpr + x * TileWidth;
					for (ty = 0; ty < TileHeight; ty++) {
						for (tx = 0; tx < TileWidth; tx++) {
							const i = ty * TileWidth + tx;
							const paletteIndex = pixels[i];
							if (paletteIndex === 0) continue;

							data[j + tx] = palette[paletteIndex];
						}
						j += bpr;
					}
				});
			}
		}

		result.data.set(byteArray);
		(renderer as any).renderImageData(result, 0, 0);

		if (!hero.visible && Settings.drawHeroTile && (<any>renderer).fillRect instanceof Function) {
			// always show hero while debugging
			(<any>renderer).fillRect(
				(hero.location.x + offset.x) * Tile.WIDTH,
				(hero.location.y + offset.y) * Tile.HEIGHT,
				Tile.WIDTH,
				Tile.HEIGHT,
				rgba(0, 0, 255, 0.3)
			);
		}

		if (Settings.drawHotspots && (<any>renderer).fillRect instanceof Function) {
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
}
export default ZoneSceneRenderer;
