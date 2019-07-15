import { NPC, Zone } from "src/engine/objects";
import { Point } from "src/util";
import { MoveCheckResult } from "./helpers";

export default (npc: NPC, zone: Zone, hero: Point): void => {
	const x_11 = npc.position.x;
	const y_14 = npc.position.y;

	let yDistance = 0;
	let movementCheckResult = 0;
	if (npc.lastDirectionChoice) {
		yDistance = 0;
		movementCheckResult = 0;
		npc.lastDirectionChoice -= 1;
	} else {
		const x_6 = npc.position.x;
		const x_ref_4 = npc.position.x;
		if (x_11 === x_6) {
			movementCheckResult = 0;
		} else {
			movementCheckResult = x_11 < x_6 ? -1 : 1;
		}
		const y_13 = npc.position.y;
		const y_ref_3 = npc.position.y;
		if (y_14 === y_13) {
			yDistance = 0;
		} else {
			yDistance = y_14 <= y_13 ? -1 : 1;
		}

		if (!movementCheckResult && !yDistance) {
			if (movementCheckResult + npc.position.x === hero.x && yDistance + npc.position.y === hero.y) {
				movementCheckResult = 0;
				yDistance = 0;
				if (npc.face.damage >= 0) {
					// TODO: play sound 'hurt'
					// TODO: change health
				}
			}
		}

		if (
			zone.getTile(movementCheckResult + npc.position.x, yDistance + npc.position.y, Zone.Layer.Object)
		) {
			return;
		}

		let can_actually_move = false;
		const tile = zone.getTile(
			movementCheckResult + npc.position.x,
			yDistance + npc.position.y,
			Zone.Layer.Floor
		);

		if (tile && !tile.isDoorway()) {
			can_actually_move = true;
		}

		if (can_actually_move) {
			npc.position.x += movementCheckResult;
			npc.position.y += yDistance;
		}
	}
};
