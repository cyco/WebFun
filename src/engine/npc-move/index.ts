import { Char, NPC, Zone, CharMovementType } from "src/engine/objects";
import { Point } from "src/util";
import { Engine } from "src/engine";
import { findTileIdForCharFrameWithDirection } from "./helpers";
import { NullIfMissing } from "src/engine/asset-manager";
import ZoneSetTileAt from "./helpers/zone-set-tile-at";
import YodaViewRedrawTile from "./helpers/yoda-view-redraw";
import unspecific1 from "./unspecific-1";
import unspecific2 from "./unspecific-2";
import sit from "./sit";
import unspecific4 from "./unspecific-4";
import unspecific5 from "./unspecific-5";
import unspecific3 from "./unspecific-3";
import droid from "./droid";
import wander from "./wander";
import patrol from "./patrol";
import scaredy from "./scaredy";
import animation from "./animation";

const dispatch = new Map([
	[CharMovementType.Unspecific1, unspecific1],
	[CharMovementType.Unspecific2, unspecific2],
	[CharMovementType.Unspecific3, unspecific3],
	[CharMovementType.Sit, sit],
	[CharMovementType.Unspecific4, unspecific4],
	[CharMovementType.Unspecific5, unspecific5],
	[CharMovementType.Droid, droid],
	[CharMovementType.Wander, wander],
	[CharMovementType.Patrol, patrol],
	[CharMovementType.Scaredy, scaredy],
	[CharMovementType.Animation, animation]
	// [CharMovementType.UnknownIndyOnly, unknownIndyOnly]
]);

function handleRemainingBullet(npc: NPC, zone: Zone, engine: Engine) {
	const hero = engine.hero.location;
	const character = engine.assetManager.get(Char, npc.face.id, NullIfMissing);
	if (!character) return;
	const weapon = engine.assetManager.get(Char, character.reference, NullIfMissing);

	if (!weapon) return;

	const tile = findTileIdForCharFrameWithDirection(weapon.frames[0], npc.direction);
	if (zone.getTile(npc.bullet.x, npc.bullet.y, Zone.Layer.Object) === tile) {
		if (!npc.bullet.isEqualTo(hero)) {
			ZoneSetTileAt(engine, zone, npc.bullet, -1);
			YodaViewRedrawTile(npc.bullet, zone);
		}
	}
	npc.field3c = 0;
	npc.bullet = new Point(npc.position);
	npc.direction = new Point(0, 0);
}

export default (npc: NPC, zone: Zone, engine: Engine): void => {
	if (!npc.face) return;
	if (!npc.enabled) {
		handleRemainingBullet(npc, zone, engine);
		return;
	}

	const moveFn = dispatch.get(npc.face.movementType) || null;
	if (moveFn) return moveFn(npc, zone, engine);
};
