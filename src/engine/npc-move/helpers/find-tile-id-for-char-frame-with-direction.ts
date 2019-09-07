import { Tile, Char } from "src/engine/objects";
import { Point } from "src/util";

export default (frame: Char.Frame, direction: Point): Tile => {
	if (direction.x === 0 && direction.y === 1) {
		return frame.down;
	}

	if (direction.x === 0 && direction.y === -1) {
		return frame.up || frame.down;
	}

	if (direction.x === 1 && direction.y === 0) {
		return frame.right || frame.down;
	}

	if (direction.x === -1 && direction.y === 0) {
		return frame.left || frame.down;
	}

	if (direction.x === -1 && direction.y === -1) {
		return frame.extensionUp || frame.down;
	}

	if (direction.x === -1 && direction.y === 1) {
		return frame.extensionDown || frame.down;
	}

	if (direction.x === 1 && direction.y === -1) {
		return frame.extensionLeft || frame.down;
	}

	if (direction.x === 1 && direction.y === 1) {
		return frame.extensionRight || frame.down;
	}

	return frame.down;
};
