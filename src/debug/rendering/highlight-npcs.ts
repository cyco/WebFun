import { Tile, NPC } from "src/engine/objects";
import { Renderer } from "src/engine/rendering";
import { Point, rgba, Rectangle, Size } from "src/util";
import { round } from "src/std/math";

const NPCHealthBarHeight = 12;
const NPCHealthBarInset = 4;

export default (renderer: Renderer, npcs: NPC[], offset: Point) => {
	if (!(renderer.fillRect instanceof Function)) return;

	npcs.forEach((n: NPC): void => {
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
		renderer.fillRect(barArea.origin.x, barArea.origin.y, barArea.size.width, barArea.size.height, color);
	});
};
