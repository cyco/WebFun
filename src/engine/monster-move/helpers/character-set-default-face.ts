import { Character, Tile } from "src/engine/objects";
import { Point } from "src/util";
import CharUpdateFaceFrame from "./character-update-face-frame";

function CharSetDefaultFace(char: Character, direction: Point): Tile {
	return CharUpdateFaceFrame(char, direction, 0);
}
export default CharSetDefaultFace;
