import { NPC, Zone } from "src/engine/objects";
import { Point } from "src/util";
import { findAnimationTileIdForCharFrame } from "./helpers";

const AnimationFrameCount = 6;

export default (npc: NPC, zone: Zone, _hero: Point): void => {
	const tile = findAnimationTileIdForCharFrame(npc.face.frames.first(), npc.facingDirection);
	zone.setTile(tile, npc.position.x, npc.position.y, Zone.Layer.Object);
	npc.facingDirection = (npc.facingDirection + 1) % AnimationFrameCount;
	return;
};
