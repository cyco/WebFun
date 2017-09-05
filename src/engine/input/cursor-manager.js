import { Direction } from "src/util";

export default class CursorManager {
	constructor(node) {
		this._node = node;
		Object.seal(this);
	}

	changeCursor(cursor) {
		let cursorName = cursor;
		if (typeof cursor === "string") {
			cursorName = cursor;
		} else if (typeof cursor === "number") {
			cursorName = this._cursorNameForDirection(cursor);
		}

		if (cursorName !== null) {
			this._node.dataset.cursor = cursorName;
		} else if (this._node.dataset.cursor === undefined) {
			delete this._node.dataset.cursor;
		}
	}

	_cursorNameForDirection(direction) {
		let cursorName = "";
		switch (direction) {
			case Direction.East:
				cursorName = "east";
				break;
			case Direction.SouthEast:
				cursorName = "south-east";
				break;
			case Direction.South:
				cursorName = "south";
				break;
			case Direction.SouthWest:
				cursorName = "south-west";
				break;
			case Direction.West:
				cursorName = "west";
				break;
			case Direction.NorthWest:
				cursorName = "north-west";
				break;
			case Direction.North:
				cursorName = "north";
				break;
			case Direction.NorthEast:
				cursorName = "north-east";
				break;
		}
		return cursorName;
	}
}
