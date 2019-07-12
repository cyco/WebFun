import { NPC, Zone, CharMovementType } from "src/engine/objects";
import { Point } from "src/util";
import animate from "./animate";
import patrol from "./patrol";
import wander from "./wander";
import none from "./none";
import sit from "./sit";
import unspecific1 from "./unspecific-1";
import unspecific2 from "./unspecific-2";
import unspecific3 from "./unspecific-3";
import unspecific4 from "./unspecific-4";
import unspecific5 from "./unspecific-5";
import unspecific6 from "./unspecific-6";
import scaredy from "./scaredy";
import unknownIndyOnly from "./unknown-indy-only";

const dispatch = new Map([
	[CharMovementType.None, none],
	[CharMovementType.Unspecific1, unspecific1],
	[CharMovementType.Unspecific2, unspecific2],
	[CharMovementType.Unspecific3, unspecific3],
	[CharMovementType.Sit, sit],
	[CharMovementType.Unspecific4, unspecific4],
	[CharMovementType.Unspecific5, unspecific5],
	[CharMovementType.Unspecific6, unspecific6],
	[CharMovementType.Wander, wander],
	[CharMovementType.Patrol, patrol],
	[CharMovementType.Scaredy, scaredy],
	[CharMovementType.Animation, animate],
	[CharMovementType.UnknownIndyOnly, unknownIndyOnly]
]);

export default (npc: NPC, zone: Zone, hero: Point): void => {
	if (!npc.enabled) {
		if (!npc.face) return;
		if (npc.face.reference < 0) return;

		// TODO: move bullet
		return;
	}

	const move = dispatch.get(npc.face.movementType) || none;
	return move(npc, zone, hero);
};
