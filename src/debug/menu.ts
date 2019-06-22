import { TestCreatorWindow } from "./components";
import { MenuItemSeparator, MenuItemState, WindowManager, FilePicker } from "src/ui";

import GameController from "src/app/game-controller";
import { main as RunGameDataEditor } from "src/editor";
import { main as RunSaveGameEditor } from "src/save-game-editor";
import ScriptDebugger from "./script-debugger";
import Settings from "src/settings";
import { Parser } from "./automation/test";

const SettingsItem = (label: string, key: keyof typeof Settings, settings: typeof Settings) => ({
	title: label,
	callback: (): void => (((settings as any)[key] = !(settings as any)[key]), void 0),
	state: (): MenuItemState => (settings[key] ? MenuItemState.On : MenuItemState.Off)
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
		SettingsAction("Create Test", () => {
			const simulator = document.createElement(TestCreatorWindow.tagName) as TestCreatorWindow;
			simulator.gameController = gameController;
			simulator.state = localStorage.prefixedWith("simulator");
			WindowManager.defaultManager.showWindow(simulator);
		}),
		SettingsAction("Load Test", async () => {
			const [file] = await FilePicker.Pick();
			if (!file) return;

			const contents = await file.readAsText();
			const testCase = Parser.Parse(file.name, contents);
			const simulator = document.createElement(TestCreatorWindow.tagName) as TestCreatorWindow;
			simulator.gameController = gameController;
			simulator.state = localStorage.prefixedWith("simulator");
			simulator.testCase = testCase;
			WindowManager.defaultManager.showWindow(simulator);
		}),
		MenuItemSeparator,
		SettingsAction("Debug Scripts", () => ScriptDebugger.sharedDebugger.show()),
		SettingsAction("Edit Game Data", RunGameDataEditor),
		SettingsAction("Edit Save Game", RunSaveGameEditor)
	]
});
