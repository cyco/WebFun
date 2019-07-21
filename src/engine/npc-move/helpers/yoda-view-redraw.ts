import { Point } from "src/util";
import { Zone } from "src/engine/objects";

function YodaViewRedrawTile(pos: Point, zone: Zone): void {
	const npcs = zone.npcs.filter(({ x, y }) => x === pos.x && y === pos.y);
	const npc = npcs.find(n => n.enabled && n.face);
	if (npc && npc.face.tile) {
		const t = npc.face.tile;
		zone.setTile(t, pos.x, pos.y, Zone.Layer.Object);
	}
}

export default YodaViewRedrawTile;
