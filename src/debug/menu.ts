import { InputRecorder, InputReplayer, SimulatorWindow } from "./components";
import { MenuItemSeparator, MenuItemState, WindowManager, FilePicker } from "src/ui";

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
		SettingsItem("Draw NPC State", "drawNPCState", gameController.settings),
		SettingsItem("Reveal World", "revealWorld", gameController.settings),
		SettingsItem("Show Hotspots", "drawHotspots", gameController.settings),
		SettingsItem("Skip Dialogs", "skipDialogs", gameController.settings),
		SettingsItem("Skip Transitions", "skipTransitions", gameController.settings),
		SettingsItem("Automatically pick up items", "pickupItemsAutomatically", gameController.settings),
		MenuItemSeparator,
		SettingsAction("Simulate Zone", () => {
			const simulator = document.createElement(SimulatorWindow.tagName) as SimulatorWindow;
			simulator.gameController = gameController;
			simulator.state = localStorage.prefixedWith("simulator");
			WindowManager.defaultManager.showWindow(simulator);
		}),
		SettingsAction("Record Input", () => {
			let recorder = document.querySelector(InputRecorder.tagName) as InputRecorder;
			if (recorder) {
				WindowManager.defaultManager.focus(recorder);
				return;
			}

			recorder = document.createElement(InputRecorder.tagName) as InputRecorder;
			recorder.gameController = gameController;
			recorder.state = localStorage.prefixedWith("input-recorder");
			WindowManager.defaultManager.showWindow(recorder);
		}),
		SettingsAction("Replay Input", async () => {
			const [file] = await FilePicker.Pick();
			if (!file) return;
			const result = await file.readAsText();

			let replayer: InputReplayer = document.querySelector(InputReplayer.tagName);
			if (!replayer) {
				replayer = document.createElement(InputReplayer.tagName) as InputReplayer;
				replayer.gameController = gameController;
				WindowManager.defaultManager.showWindow(replayer);
			}

			replayer.load(result.split(" "));
			replayer.start();
			replayer.fastForward();
			WindowManager.defaultManager.focus(replayer);
		}),
		MenuItemSeparator,
		SettingsAction("Debug Scripts", () => ScriptDebugger.sharedDebugger.show()),
		SettingsAction("Edit Game Data", RunGameDataEditor),
		SettingsAction("Edit Save Game", RunSaveGameEditor)
	]
});
