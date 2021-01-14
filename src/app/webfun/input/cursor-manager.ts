import { Direction } from "src/util";
import "./cursor-manager.scss";

class CursorManager {
	private _node: HTMLElement;

	constructor(node: HTMLElement) {
		this._node = node;
	}

	public changeCursor(cursor: string | number): void {
		let cursorName = null;

		if (typeof cursor === "string") {
			cursorName = cursor;
		}

		if (typeof cursor === "number") {
			cursorName = this._cursorNameForDirection(cursor);
		}

		if (cursorName !== null) {
			this._node.dataset.cursor = `${cursorName}`;
		} else {
			delete this._node.dataset.cursor;
		}
	}

	private _cursorNameForDirection(direction: Direction) {
		switch (direction) {
			case Direction.East:
				return "east";
			case Direction.SouthEast:
				return "south-east";
			case Direction.South:
				return "south";
			case Direction.SouthWest:
				return "south-west";
			case Direction.West:
				return "west";
			case Direction.NorthWest:
				return "north-west";
			case Direction.North:
				return "north";
			case Direction.NorthEast:
				return "north-east";
			default:
				console.assert(false, "Invalid direction given!");
		}
	}
}

export default CursorManager;
