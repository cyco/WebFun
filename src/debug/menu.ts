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
import Simulator from "./simulator";
import SaveGameEditor from 'src/save-game-editor/save-game-editor';
import { FilePicker } from 'src/ui';

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

		...(gameController.settings.editor
			? [
				SettingsAction("Switch to Editor", () => {
					const editor = <Editor>document.createElement(Editor.TagName);
					const state = localStorage.prefixedWith("editor");

					editor.addInspector("tile", new TileInspector(state.prefixedWith("tile")));
					editor.addInspector("zone", new ZoneInspector(state.prefixedWith("zone")));
					editor.addInspector("sound", new SoundInspector(state.prefixedWith("sound")));
					editor.addInspector("puzzle", new PuzzleInspector(state.prefixedWith("puzzle")));
					editor.addInspector("character", new CharacterInspector(state.prefixedWith("character")));
					editor.addInspector("setup-image", new SetupImageInspector(state.prefixedWith("setup-image")));
					editor.addInspector("palette", new PaletteInspector(state.prefixedWith("palette")));

					const setupData = (g: GameData, p: ColorPalette) => (editor.data = new DataManager(g, p));
					if (gameController.isDataLoaded()) {
						setupData(gameController.data, gameController.palette);
					} else {
						gameController.addEventListener(GameController.Event.DidLoadData, (e: CustomEvent) =>
							setupData(e.detail.data, e.detail.palette)
						);
					}

					WindowManager.defaultManager.showWindow(editor);
				})
			]
			: []),

		...[
			SettingsAction("Simulate Zone", () => {
				const setupData = (g: GameData, p: ColorPalette) => {
					const simulator = new Simulator();
					simulator.data = new DataManager(g, p);
					simulator.start();
				};

				if (gameController.isDataLoaded()) {
					setupData(gameController.data, gameController.palette);
				} else {
					gameController.addEventListener(GameController.Event.DidLoadData, (e: CustomEvent) =>
						setupData(e.detail.data, e.detail.palette)
					);
				}
			})
		],
		...[
			SettingsAction("Edit Save Game", () => {
				const setupData = async (g: GameData, p: ColorPalette) => {
					const files = await FilePicker.Pick({ allowsMultipleFiles: true });

					files.forEach((file) => {
						const saveGameEditor = <SaveGameEditor>document.createElement(SaveGameEditor.TagName);
						saveGameEditor.gameDataManager = new DataManager(g, p);
						saveGameEditor.file = file;
						WindowManager.defaultManager.showWindow(saveGameEditor);
					});
				};

				if (gameController.isDataLoaded()) {
					setupData(gameController.data, gameController.palette);
				} else {
					gameController.addEventListener(GameController.Event.DidLoadData, (e: CustomEvent) =>
						setupData(e.detail.data, e.detail.palette)
					);
				}
			})
		]
	]
});
