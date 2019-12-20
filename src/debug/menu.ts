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
	callback: (): void => void ((settings as any)[key] = !(settings as any)[key]),
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
		SettingsItem("Draw Monster State", "drawMonsterState", gameController.settings),
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
			const testCases = Parser.Parse(file.name, contents);
			testCases.forEach(testCase => {
				const simulator = document.createElement(TestCreatorWindow.tagName) as TestCreatorWindow;
				simulator.gameController = gameController;
				simulator.state = localStorage.prefixedWith("simulator");
				simulator.testCase = testCase;
				WindowManager.defaultManager.showWindow(simulator);
			});
		}),
		MenuItemSeparator,
		SettingsAction("Debug Scripts", () => ScriptDebugger.sharedDebugger.show()),
		SettingsAction("Edit Current Data", () =>
			RunGameDataEditor(WindowManager.defaultManager, gameController.data)
		),
		SettingsAction("Edit Game Data...", RunGameDataEditor),
		SettingsAction("Edit Save Game...", RunSaveGameEditor)
	]
});
