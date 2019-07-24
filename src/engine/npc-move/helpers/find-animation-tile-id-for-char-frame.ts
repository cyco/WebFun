import { CharFrame, CharFrameEntry, Tile } from "src/engine/objects";

export default (frame: CharFrame, direction: number): Tile => {
	switch (direction) {
		case CharFrameEntry.Up:
			return frame.up;
		case CharFrameEntry.Down:
			return frame.down;
		case CharFrameEntry.ExtensionUp:
			return frame.extensionUp;
		case CharFrameEntry.Left:
			return frame.left;
		case CharFrameEntry.ExtensionDown:
			return frame.extensionDown;
		case CharFrameEntry.ExtensionLeft:
			return frame.extensionLeft;
	}
};
