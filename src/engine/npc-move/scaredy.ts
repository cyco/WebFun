import { NPC, Zone, Tile } from "src/engine/objects";
import { Point, randmod } from "src/util";
import { abs } from "src/std/math";
import { movePartial, performMove } from "./helpers";

const distanceLessThan = (p1: Point, p2: Point, max: number): boolean =>
	abs(p1.x - p2.x) < max && abs(p1.y - p2.y) < max;
const diff = (p1: Point, p2: Point) => {
	const p = p1.bySubtracting(p2);
	return new Point(p.x / abs(p.x) || 0, p.y / abs(p.y) || 0);
};
const randRel = () => new Point(randmod(3) - 1, randmod(3) - 1);

export default (npc: NPC, zone: Zone, hero: Point): void => {
	let target: Point;
	let rel = distanceLessThan(npc.position, hero, 6) ? diff(npc.position, hero) : randRel();

	do {
		rel = movePartial(npc.position, rel, zone);

		target = npc.position.byAdding(rel);
		if (target.isEqualTo(hero)) {
			target = npc.position;
			rel = new Point(0, 0);

			if (npc.face.damage) {
				// TODO: play sound hurt
				// TODO: damage hero
			}
		}

		if (zone.getTile(target.x, target.y, Zone.Layer.Object)) {
			return;
		}

		const tile = zone.getTile(target.x, target.y, Zone.Layer.Floor);
		if (!tile) {
			return;
		}

		if (!tile.isDoorway()) {
			break;
		}

		rel = randRel();
		console.log(rel);
	} while (true);

	npc.position = target;
	performMove(npc, rel, hero, zone);
};
