import { Character, Tile } from "src/engine/objects";

export default (frame: Character.Frame, direction: number): Tile => {
	if (!frame) return null;

	switch (direction) {
		case Character.FrameEntry.Up:
			return frame.up;
		case Character.FrameEntry.Down:
			return frame.down;
		case Character.FrameEntry.ExtensionUp:
			return frame.extensionUp;
		case Character.FrameEntry.Left:
			return frame.left;
		case Character.FrameEntry.ExtensionDown:
			return frame.extensionDown;
		case Character.FrameEntry.ExtensionLeft:
			return frame.extensionLeft;
	}
};
