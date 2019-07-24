import { Renderer } from "src/engine/rendering";
import { Point, rgba } from "src/util";
import { Tile } from "src/engine/objects";

export default (renderer: Renderer, hero: Point, offset: Point) => {
	if (!(renderer.fillRect instanceof Function)) return;

	renderer.fillRect(
		(hero.x + offset.x) * Tile.WIDTH,
		(hero.y + offset.y) * Tile.HEIGHT,
		Tile.WIDTH,
		Tile.HEIGHT,
		rgba(0, 0, 255, 0.3)
	);
};
