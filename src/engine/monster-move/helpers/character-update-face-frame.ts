import { Character, Tile } from "src/engine/objects";
import { Point } from "src/util";
import { findTileIdForCharacterFrameWithDirection } from ".";

function CharUpdateFaceFrame(char: Character, direction: Point, frame: number): Tile {
	const t1 = findTileIdForCharacterFrameWithDirection(char.frames[frame], direction);
	const t2 = findTileIdForCharacterFrameWithDirection(char.frames[0], direction);
	char.tile = t1 || t2;

	return char.tile;
}

export default CharUpdateFaceFrame;
