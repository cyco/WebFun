import { Tile, Hotspot } from "src/engine/objects";
import { Renderer } from "src/engine/rendering";
import { Point, rgba } from "src/util";

export default (renderer: Renderer, hotspots: Hotspot[], offset: Point) => {
	if (!(renderer.fillRect instanceof Function)) return;

	hotspots.forEach((h: Hotspot): void => {
		renderer.fillRect(
			(h.x + offset.x) * Tile.WIDTH,
			(h.y + offset.y) * Tile.HEIGHT,
			Tile.WIDTH,
			Tile.HEIGHT,
			h.enabled ? rgba(0, 255, 0, 0.3) : rgba(255, 0, 0, 0.3)
		);
	});
};
