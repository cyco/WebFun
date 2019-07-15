import { Zone, NPC } from "src/engine/objects";
import { Point } from "src/util";
import findTileIdForCharFrameWithDirection from "./find-tile-id-for-char-frame-with-direction";

export default (npc: NPC, rel: Point, hero: Point, zone: Zone) => {
	zone.setTile(null, npc.position.x - rel.x, npc.position.y - rel.y, Zone.Layer.Object);
	let tile = findTileIdForCharFrameWithDirection(npc.face.frames.first(), new Point(rel.x, rel.y));

	// look at hero if he's in the same column or row
	if (hero.x === npc.position.x && hero.y < npc.position.y) {
		tile = findTileIdForCharFrameWithDirection(npc.face.frames.first(), new Point(0, -1));
	} else if (hero.x === npc.position.x && hero.y > npc.position.y) {
		tile = findTileIdForCharFrameWithDirection(npc.face.frames.first(), new Point(0, 1));
	} else if (hero.y === npc.position.y && hero.x < npc.position.x) {
		tile = findTileIdForCharFrameWithDirection(npc.face.frames.first(), new Point(-1, 0));
	} else if (hero.y === npc.position.y && hero.x > npc.position.x) {
		tile = findTileIdForCharFrameWithDirection(npc.face.frames.first(), new Point(1, 0));
	}
	zone.setTile(tile, npc.position.x, npc.position.y, Zone.Layer.Object);
};
