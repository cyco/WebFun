import { MenuItemSeparator, MenuItemState, WindowManager, FilePicker } from "src/ui";

import GameController from "src/app/game-controller";
import Settings from "src/settings";

const SettingsItem = (label: string, key: keyof typeof Settings, settings: typeof Settings) => ({
	title: label,
	callback: (): void => void ((settings as any)[key] = !(settings as any)[key]),
	state: (): MenuItemState => (settings[key] ? MenuItemState.On : MenuItemState.Off)
});

const SettingsAction = (title: string, callback: Function, beta: boolean = false) => ({
	title,
	callback,
	beta
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
		SettingsAction("Create Test", async () => {
			const TestCreatorWindow = (await import("./components")).TestCreatorWindow;
			const simulator = document.createElement(TestCreatorWindow.tagName) as InstanceType<
				typeof TestCreatorWindow
			>;
			simulator.gameController = gameController;
			simulator.state = localStorage.prefixedWith("simulator");
			WindowManager.defaultManager.showWindow(simulator);
		}),
		SettingsAction("Load Test", async () => {
			const [file] = await FilePicker.Pick();
			if (!file) return;

			const contents = await file.readAsText();
			const Parser = (await import("./automation/test")).Parser;
			const testCases = Parser.Parse(file.name, contents);

			const TestCreatorWindow = (await import("./components")).TestCreatorWindow;
			testCases.forEach(testCase => {
				const simulator = document.createElement(TestCreatorWindow.tagName) as InstanceType<
					typeof TestCreatorWindow
				>;
				simulator.gameController = gameController;
				simulator.state = localStorage.prefixedWith("simulator");
				simulator.testCase = testCase;
				WindowManager.defaultManager.showWindow(simulator);
			});
		}),
		MenuItemSeparator,
		SettingsAction("Debug Scripts", async () =>
			(await import("./script-debugger")).default.sharedDebugger.show()
		),
		SettingsAction(
			"Edit Current Data",
			async () => (await import("src/editor")).main(WindowManager.defaultManager, gameController.data),
			true
		),
		SettingsAction("Edit Game Data...", async () => (await import("src/editor")).main(), true),
		SettingsAction("Edit Save Game...", async () => (await import("src/save-game-editor")).main(), true)
	]
});
