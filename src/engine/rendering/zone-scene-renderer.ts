import { Char, Tile, Zone } from "src/engine/objects";

import Renderer from "src/engine/rendering/renderer";
import ColorPalette from "src/engine/rendering/color-palette";
import Sprite from "src/engine/rendering/sprite";
import Engine from "src/engine/engine";
import Settings from "src/settings";
import {
	highlightHero,
	highlightHotspots,
	highlightMonsters
} from "src/app/webfun/debug/rendering";
import { NullIfMissing } from "../asset-manager";
import { findTileIdForCharFrameWithDirection } from "../monster-move/helpers";

class ZoneSceneRenderer {
	public render(
		zone: Zone,
		engine: Engine,
		renderer: Renderer,
		palette: ColorPalette,
		sprites: Sprite[]
	): void {
		const offset = engine.camera.offset;
		const TileWidth = Tile.WIDTH;
		const TileHeight = Tile.HEIGHT;
		const ZoneLayers = Zone.LAYERS;
		const VisibleWidth = 9;
		const VisibleHeight = 9;

		const firstXTile = -offset.x;
		const firstYTile = -offset.y;
		const result = new ImageData(VisibleWidth * TileWidth, VisibleHeight * TileHeight);
		const buffer = new ArrayBuffer(result.data.length);
		const byteArray = new Uint8Array(buffer);
		const data = new Uint32Array(buffer);

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

		const drawImageAt = (
			pixels: Uint8Array,
			x: number,
			y: number,
			width: number,
			height: number
		) => {
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
						const x = hero.location.x + offset.x;
						const y = hero.location.y + offset.y;
						if (x >= 0 && x < VisibleWidth && y >= 0 && y < VisibleHeight) {
							drawTileAt(tile, x, y);
						}
					}
				}

				for (const monster of zone.monsters) {
					if (!monster.bulletOffset) {
						continue;
					}
					const weapon = engine.assets.get(Char, monster.face.reference, NullIfMissing);
					if (!weapon) continue;
					const tile = findTileIdForCharFrameWithDirection(weapon.frames[0], monster.direction);
					drawTileAt(tile, monster.bulletX + offset.x, monster.bulletY + offset.y);
				}

				sprites.forEach(sprite => {
					const x = sprite.position.x + offset.x;
					const y = sprite.position.y + offset.y;
					console.assert(
						0 <= x && x <= VisibleHeight && 0 <= y && y <= VisibleHeight,
						"Sprites must be located on the zone."
					);

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

		if (!hero.visible && Settings.drawHeroTile) {
			highlightHero(renderer, hero.location, offset);
		}

		if (Settings.drawHotspots) {
			highlightHotspots(renderer, zone.hotspots, offset);
		}

		if (Settings.drawMonsterState) {
			highlightMonsters(renderer, zone.monsters, offset);
		}
	}
}
export default ZoneSceneRenderer;
