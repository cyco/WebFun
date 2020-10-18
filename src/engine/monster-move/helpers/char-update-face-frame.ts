import { Char, Tile } from "src/engine/objects";
import { Point } from "src/util";
import { findTileIdForCharFrameWithDirection } from ".";

function CharUpdateFaceFrame(char: Char, direction: Point, frame: number): Tile {
	const t1 = findTileIdForCharFrameWithDirection(char.frames[frame], direction);
	const t2 = findTileIdForCharFrameWithDirection(char.frames[0], direction);
	char.tile = t1 || t2;

	return char.tile;
}

export default CharUpdateFaceFrame;
