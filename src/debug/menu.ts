import { InputRecorder, SimulatorWindow } from "./components";
import { MenuItemSeparator, MenuItemState, WindowManager } from "src/ui";

import GameController from "src/app/game-controller";
import { main as RunGameDataEditor } from "src/editor";
import { main as RunSaveGameEditor } from "src/save-game-editor";
import ScriptDebugger from "./script-debugger";
import Settings from "src/settings";

const SettingsItem = (label: string, key: keyof typeof Settings, settings: typeof Settings) => ({
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
		SettingsAction("Simulate Zone", () => {
			const simulator = document.createElement(SimulatorWindow.tagName) as SimulatorWindow;
			simulator.gameController = gameController;
			simulator.state = localStorage.prefixedWith("simulator");
			WindowManager.defaultManager.showWindow(simulator);
		}),
		SettingsAction("Record Input", () => {
			const recorder = document.createElement(InputRecorder.tagName) as InputRecorder;
			recorder.gameController = gameController;
			recorder.state = localStorage.prefixedWith("input-recorder");
			WindowManager.defaultManager.showWindow(recorder);
		}),
		MenuItemSeparator,
		SettingsAction("Debug Scripts", () => ScriptDebugger.sharedDebugger.show()),
		SettingsAction("Edit Game Data", RunGameDataEditor),
		SettingsAction("Edit Save Game", RunSaveGameEditor)
	]
});
