import { NPC, Zone } from "src/engine/objects";
import { Point, randmod } from "src/util";
import { moveCheck, MoveCheckResult, findTileIdForCharFrameWithDirection } from "./helpers";

export default (npc: NPC, zone: Zone, hero: Point): void => {
	let relX = 0,
		relY = 0;
	// npc.lastDirectionChoice <-- direction change cooldown
	// npc.field30 <-- current direction
	if (npc.lastDirectionChoice) {
		relX = 0;
		relY = 0;
		npc.lastDirectionChoice -= 1;
	} else {
		switch (npc.field30 + 1) {
			case 0:
				relX = 0;
				relY = -1;
				break;
			case 1:
				relX = 0;
				relY = 1;
				break;
			case 2:
				relX = 1;
				relY = 0;
				break;
			case 3:
				relX = -1;
				relY = 0;
				break;
		}
	}

	let canMove = moveCheck(npc.position, new Point(relX, relY), zone);
	if (canMove !== MoveCheckResult.Free) {
		relX = 0;
		relY = 0;
		npc.lastDirectionChoice = randmod(3);
		npc.field30 = randmod(4) - 1; // TODO: check random
	}

	if (npc.position.byAdding(relX, relY).isEqualTo(hero)) {
		relX = 0;
		relY = 0;

		if (npc.face.reference === -1 && npc.face.damage >= 0) {
			// TODO: Change health
			// TODO: Play hurt sound
		}
	}

	const target = npc.position.byAdding(relX, relY);
	if (zone.getTile(target.x, target.y, Zone.Layer.Object)) {
		// TODO: goto no movement
		return;
	}

	const targetTile = zone.getTile(target.x, target.y, Zone.Layer.Object);
	if (!targetTile) {
		canMove = MoveCheckResult.Free;
	}

	if (canMove === MoveCheckResult.Free) {
		npc.position = target;
	}

	// perform move
	zone.setTile(null, npc.position.x - relX, npc.position.y - relY, Zone.Layer.Object);
	let tile = findTileIdForCharFrameWithDirection(npc.face.frames.first(), new Point(relX, relY));

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
