import Settings from "src/settings";
import { MenuItemSeparator, MenuItemState } from "src/ui";
import ScriptDebugger from "./script-debugger";
import Editor from "src/editor/editor";
import PrefixedStorage from "src/util/prefixed-storage";
import TileInspector from "src/editor/inspectors/tile-inspector";
import ZoneInspector from "src/editor/inspectors/zone-inspector";
import SoundInspector from "src/editor/inspectors/sound-inspector";
import PuzzleInspector from "src/editor/inspectors/puzzle-inspector";
import CharacterInspector from "src/editor/inspectors/character-inspector";
import PaletteInspector from "src/editor/inspectors/palette-inspector";
import SetupImageInspector from "src/editor/inspectors/setup-image-inspector";
import DataManager from "src/editor/data-manager";
import GameController from "src/app/game-controller";
import WindowManager from "src/ui/window-manager";
import GameData from "src/engine/game-data";
import ColorPalette from "src/engine/rendering/color-palette";
import { FilePicker } from "src/ui";
import { main as RunSaveGameEditor } from "src/save-game-editor";
import { main as RunGameDataEditor } from "src/editor";

const SettingsItem = (label: string, key: string, settings: typeof Settings) => ({
	title: label,
	callback: () => (settings[key] = !settings[key]),
	state: () => (settings[key] ? MenuItemState.On : MenuItemState.Off)
});

const SettingsAction = (label: string, callback: Function) => ({
	title: label,
	callback: callback
});

export default (gameController: GameController) => ({
	title: "Debug",
	mnemonic: 0,
	submenu: [
		SettingsItem("Draw Debug Stats", "drawDebugStats", gameController.settings),
		SettingsItem("Draw invisible Hero", "drawHeroTile", gameController.settings),
		SettingsItem("Reveal World", "revealWorld", gameController.settings),
		SettingsItem("Show Hotspots", "drawHotspots", gameController.settings),
		SettingsItem("Skip Dialogs", "skipDialogs", gameController.settings),
		MenuItemSeparator,
		SettingsAction("Debug Scripts", () => ScriptDebugger.sharedDebugger.show()),
		SettingsAction("Edit Game Data", RunGameDataEditor),
		SettingsAction("Edit Save Game", RunSaveGameEditor)
	]
});
