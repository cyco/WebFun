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

const SettingsItem = (label: string, key: string, settings: typeof Settings) => ({
	title: label,
	callback: () => settings[key] = !settings[key],
	state: () => settings[key] ? MenuItemState.On : MenuItemState.Off
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

		...(gameController.settings.editor ? [
			SettingsAction("Switch to Editor", () => {
				const editor = <Editor>document.createElement(Editor.TagName);
				const state = new PrefixedStorage(localStorage, "editor");

				editor.addInspector("tile", new TileInspector(state.prefixedWith("tile")));
				editor.addInspector("zone", new ZoneInspector(state.prefixedWith("zone")));
				editor.addInspector("sound", new SoundInspector(state.prefixedWith("sound")));
				editor.addInspector("puzzle", new PuzzleInspector(state.prefixedWith("puzzle")));
				editor.addInspector("character", new CharacterInspector(state.prefixedWith("character")));
				editor.addInspector("setup-image", new SetupImageInspector(state.prefixedWith("setup-image")));
				editor.addInspector("palette", new PaletteInspector(state.prefixedWith("palette")));

				gameController.addEventListener(GameController.Event.DidLoadData, (e: CustomEvent) => {
					const gameData = e.detail.data;
					const palette = e.detail.palette;

					editor.data = new DataManager(gameData, palette);
				});

				document.body.appendChild(editor);
			})] : [])
	]
});
