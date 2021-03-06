import { Point } from "src/util";
import { Zone } from "src/engine/objects";

function YodaViewRedrawTile(pos: Point, zone: Zone): void {
	const monsters = zone.monsters.filter(({ x, y }) => x === pos.x && y === pos.y);
	const monster = monsters.find(n => n.enabled && n.face && n.alive);
	if (monster && monster.face.tile && zone.bounds.contains(pos)) {
		const t = monster.face.tile;
		zone.setTile(t, pos.x, pos.y, Zone.Layer.Object);
	}
}

export default YodaViewRedrawTile;
