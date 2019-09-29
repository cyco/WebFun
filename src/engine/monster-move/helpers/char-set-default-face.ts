import { Char, Tile } from "src/engine/objects";
import { Point } from "src/util";
import CharUpdateFaceFrame from "./char-update-face-frame";

function CharSetDefaultFace(char: Char, direction: Point): Tile {
	return CharUpdateFaceFrame(char, direction, 0);
}
export default CharSetDefaultFace;
