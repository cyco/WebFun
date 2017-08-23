import { Type as ZoneType } from "../../objects/zone";
import { Type as PuzzleType } from "../../objects/puzzle";

const toPuzzleType = function () {
	switch (this) {
		case ZoneType.Use:
			return PuzzleType.U1;
		case ZoneType.Unknown:
			return PuzzleType.End;
		case ZoneType.Goal:
			return PuzzleType.U3;
		case ZoneType.Trade:
			return PuzzleType.U2;
		default:
			throw `Zone type ${this} does not match a puzzle type!`;
	}
};
Number.prototype.toPuzzleType = toPuzzleType;
export default toPuzzleType;
