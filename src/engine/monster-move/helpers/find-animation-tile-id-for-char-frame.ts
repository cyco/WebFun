import { Char, Tile } from "src/engine/objects";

export default (frame: Char.Frame, direction: number): Tile => {
	if (!frame) return null;

	switch (direction) {
		case Char.FrameEntry.Up:
			return frame.up;
		case Char.FrameEntry.Down:
			return frame.down;
		case Char.FrameEntry.ExtensionUp:
			return frame.extensionUp;
		case Char.FrameEntry.Left:
			return frame.left;
		case Char.FrameEntry.ExtensionDown:
			return frame.extensionDown;
		case Char.FrameEntry.ExtensionLeft:
			return frame.extensionLeft;
	}
};
