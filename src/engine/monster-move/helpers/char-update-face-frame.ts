import { Char, Tile } from "src/engine/objects";
import { Point } from "src/util";
import { findTileIdForCharFrameWithDirection } from ".";

function CharUpdateFaceFrame(char: Char, direction: Point, frame: number): Tile {
	return (char.tile =
		findTileIdForCharFrameWithDirection(char.frames[frame], direction) ||
		findTileIdForCharFrameWithDirection(char.frames[0], direction));
}

export default CharUpdateFaceFrame;
