import { Tile, Zone, NPC } from "src/engine/objects";

import Renderer from "src/engine/rendering/renderer";
import ColorPalette from "src/engine/rendering/color-palette";
import Sprite from "src/engine/rendering/sprite";
import Engine from "src/engine/engine";
import Hotspot from "../objects/hotspot";
import Settings from "src/settings";
import { rgba, Rectangle, Size } from "src/util";
import { round } from "src/std/math";

const NPCHealthBarHeight = 12;
const NPCHealthBarInset = 4;

class ZoneSceneRenderer {
	public render(zone: Zone, engine: Engine, renderer: Renderer, palette: ColorPalette, sprites: Sprite[]) {
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

		const drawOpaqueTileAt = (tile: Tile, x: number, y: number) => {
			const pixels = tile.imageData;
			let tx, ty;
			let j = y * TileHeight * bpr + x * TileWidth;
			for (ty = 0; ty < TileHeight; ty++) {
				for (tx = 0; tx < TileWidth; tx++) {
					data[j + tx] = palette[pixels[ty * TileWidth + tx]];
				}
				j += bpr;
			}
		};

		const drawImageAt = (pixels: Uint8Array, x: number, y: number, width: number, height: number) => {
			let tx, ty;
			let j = y * bpr + x;
			for (ty = 0; ty < height; ty++) {
				for (tx = 0; tx < width; tx++) {
					const paletteIndex = pixels[ty * width + tx];
					if (paletteIndex === 0) continue;

					data[j + tx] = palette[paletteIndex];
				}
				j += bpr;
			}
		};

		const drawTileAt = (tile: Tile, x: number, y: number) => {
			drawImageAt(tile.imageData, x * TileWidth, y * TileHeight, TileWidth, TileHeight);
		};

		const hero = engine.hero;
		const bpr = VisibleWidth * TileWidth;
		let x, y, z;
		for (z = 0; z < ZoneLayers; z++) {
			for (y = 0; y < VisibleHeight; y++) {
				for (x = 0; x < VisibleWidth; x++) {
					const tile = zone.getTile(x + firstXTile, y + firstYTile, z);
					if (!tile) continue;
					if (tile.isOpaque()) drawOpaqueTileAt(tile, x, y);
					else drawTileAt(tile, x, y);
				}
			}

			if (z === 1) {
				if (hero.visible) {
					let appearance = hero._appearance;
					const frame = hero._actionFrames;
					if ((hero as any)._attacking) {
						appearance = hero.weapon;
					}

					const tile = appearance.getFace(hero._direction, frame);
					if (tile) {
						const x = hero._location.x + offset.x;
						const y = hero._location.y + offset.y;
						if (x >= 0 && x < VisibleWidth && y >= 0 && y < VisibleHeight) {
							drawTileAt(tile, x, y);
						}
					}
				}

				zone.npcs.forEach(npc => {
					const tile = npc.face.frames[0].down;
					if (!tile) return;
					if (!npc.alive) return;

					const x = npc.position.x + offset.x;
					const y = npc.position.y + offset.y;
					if (x < 0 || x >= VisibleWidth) return;
					if (y < 0 || y >= VisibleHeight) return;
					drawTileAt(tile, x, y);
				});

				sprites.forEach(sprite => {
					const x = sprite.position.x + offset.x;
					const y = sprite.position.y + offset.y;
					if (x < 0 || x >= VisibleWidth) return;
					if (y < 0 || y >= VisibleHeight) return;

					drawImageAt(
						sprite.pixels,
						x * TileWidth,
						y * TileHeight,
						sprite.size.width,
						sprite.size.height
					);
				});
			}
		}

		result.data.set(byteArray);
		renderer.renderImageData(result, 0, 0);

		if (!hero.visible && Settings.drawHeroTile && renderer.fillRect instanceof Function) {
			// always show hero while debugging
			renderer.fillRect(
				(hero.location.x + offset.x) * Tile.WIDTH,
				(hero.location.y + offset.y) * Tile.HEIGHT,
				Tile.WIDTH,
				Tile.HEIGHT,
				rgba(0, 0, 255, 0.3)
			);
		}

		if (Settings.drawHotspots && renderer.fillRect instanceof Function) {
			zone.hotspots.forEach((h: Hotspot): void => {
				renderer.fillRect(
					(h.x + offset.x) * Tile.WIDTH,
					(h.y + offset.y) * Tile.HEIGHT,
					Tile.WIDTH,
					Tile.HEIGHT,
					h.enabled ? rgba(0, 255, 0, 0.3) : rgba(255, 0, 0, 0.3)
				);
			});
		}

		if (Settings.drawNPCState && renderer.fillRect instanceof Function) {
			zone.npcs.forEach((n: NPC): void => {
				if (!n.alive) return;

				const barArea = new Rectangle(
					n.position
						.byAdding(offset)
						.byScalingBy(Tile.WIDTH)
						.byAdding(0, Tile.HEIGHT - NPCHealthBarHeight),
					new Size(Tile.WIDTH, NPCHealthBarHeight)
				).inset(NPCHealthBarInset, NPCHealthBarInset);

				renderer.fillRect(
					barArea.origin.x,
					barArea.origin.y,
					barArea.size.width,
					barArea.size.height,
					rgba(0, 0, 0, 0.2)
				);

				const health = 1 - n.damageTaken / n.face.health;
				let color = rgba(0, 255, 0, 0.6);
				if (health < 1 / 2) color = rgba(255, 255, 0, 0.6);
				if (health < 1 / 3) color = rgba(255, 0, 0, 0.6);

				barArea.size.width = round(barArea.size.width * health);
				renderer.fillRect(
					barArea.origin.x,
					barArea.origin.y,
					barArea.size.width,
					barArea.size.height,
					color
				);
			});
		}
	}
}
export default ZoneSceneRenderer;
