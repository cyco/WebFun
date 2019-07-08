import { NPC, Zone } from "src/engine/objects";
import { Point } from "src/util";
import { findTileIdForCharFrameWithDirection } from "./helpers";

export default (npc: NPC, zone: Zone, hero: Point): void => {
	const moveDirection = new Point(0, 0);
	const moveDistance = 0;
	if (npc.position.x === hero.x) {
		moveDirection.x = 0;
	} else if (npc.position.x < hero.x) {
		moveDirection.x = 1;
	} else {
		moveDirection.x = -1;
	}

	if (npc.position.y === hero.y) {
		moveDirection.y = 0;
	} else if (npc.position.y < hero.y) {
		moveDirection.y = 1;
	} else {
		moveDirection.y = -1;
	}

	const tile = findTileIdForCharFrameWithDirection(npc.face.frames.first(), moveDirection);
	zone.setTile(tile, npc.position.x, npc.position.y, Zone.Layer.Object);
	return;
};
