import Menu from "./menu";
import { ComponentRegistry } from "src/ui";
import * as Components from "./components";
import Editor from "src/editor/editor";
import TileInspector from "src/editor/inspectors/tile-inspector";
import ZoneInspector from "src/editor/inspectors/zone-inspector";
import SoundInspector from "src/editor/inspectors/sound-inspector";
import PuzzleInspector from "src/editor/inspectors/puzzle-inspector";
import CharacterInspector from "src/editor/inspectors/character-inspector";
import SetupImageInspector from "src/editor/inspectors/setup-image-inspector";
import PrefixedStorage from "src/util/prefixed-storage";

const initialize = () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);

	const inspectors = {
		"tile": new TileInspector(),
		"zone": new ZoneInspector(),
		"sound": new SoundInspector(),
		"puzzle": new PuzzleInspector(),
		"character": new CharacterInspector(),
		"setup-image": new SetupImageInspector()
	};

	Editor.sharedEditor = new Editor(inspectors);
	Editor.sharedEditor.storage = new PrefixedStorage(localStorage, "editor");
};

export { initialize, Menu };
