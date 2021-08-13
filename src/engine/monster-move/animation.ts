import { Monster, Zone, Character } from "../objects";
import { Point } from "src/util";
import { findAnimationTileIdForCharacterFrame } from "./helpers";
import { Engine } from "src/engine";
import CharSetDefaultFace from "./helpers/character-set-default-face";
import YodaViewRedrawTile from "./helpers/yoda-view-redraw";
import ZoneSetTileAt from "./helpers/zone-set-tile-at";

function updateFaceAndRedraw(monster: Monster, zone: Zone, engine: Engine) {
	const tile = findAnimationTileIdForCharacterFrame(
		monster.face.frames.first(),
		monster.facingDirection
	);
	ZoneSetTileAt(engine, zone, monster.position, tile.id);
	monster.facingDirection++;
	monster.facingDirection %= 6;
}

function maybeRestoreFaceThenDraw(monster: Monster, direction: Point, zone: Zone, engine: Engine) {
	if (monster.flag34) {
		CharSetDefaultFace(monster.face, direction);
		monster.flag34 = false;
	}
	return updateFaceAndRedraw(monster, zone, engine);
}

export default (monster: Monster, zone: Zone, engine: Engine): void => {
	const hero = engine.hero.location;
	const direction = hero.comparedTo(monster.position);

	if (!monster.face) {
		// TODO: this was break and might have jumped to handle bullet
		YodaViewRedrawTile(monster.position, zone);
		return;
	}

	console.assert(monster.face.movementType !== Character.MovementType.Unspecific3);

	if (direction.x || direction.y) {
		return maybeRestoreFaceThenDraw(monster, direction, zone, engine);
	}

	if (monster.x === hero.x) {
		direction.x = -1;
		if (monster.x <= hero.x) direction.x = 0;
	} else {
		if (monster.y !== hero.y) {
			return maybeRestoreFaceThenDraw(monster, direction, zone, engine);
		}
		if (monster.x >= hero.x) {
			direction.x = -1;
			if (monster.x <= hero.x) direction.x = 0;
		} else {
			direction.x = 1;
		}
	}
	if (monster.y >= hero.y) {
		direction.y = -1;
		if (monster.y <= hero.y) direction.y = 0;
	} else {
		direction.y = 1;
	}
	CharSetDefaultFace(monster.face, direction);
	return maybeRestoreFaceThenDraw(monster, direction, zone, engine);
};
