import { MenuItemInit, MenuItemSeparator, MenuItemState } from "src/ui";

import GameController from "src/app/webfun/game-controller";
import Settings from "src/settings";
import loadTest from "./load-test";
import { navigator } from "src/std/dom";

const SettingsItem = (label: string, key: keyof Settings, settings: Settings) => ({
	title: label,
	callback: (): void => void ((settings as any)[key] = !(settings as any)[key]),
	state: (): MenuItemState => (settings[key] ? MenuItemState.On : MenuItemState.Off)
});

const SettingsAction = (title: string, callback: () => void, beta: boolean = false) => ({
	title,
	callback,
	beta
});

export default (gameController: GameController): Partial<MenuItemInit> => {
	import("./initialize").then(({ default: initialize }) => initialize());
	import("src/app/editor");

	return {
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
			SettingsItem(
				"Automatically pick up items",
				"pickupItemsAutomatically",
				gameController.settings
			),
			MenuItemSeparator,
			SettingsAction("Clear Settings", () => {
				localStorage.clear();
			}),
			MenuItemSeparator,
			SettingsAction("Install Service Workers", async () => {
				navigator.serviceWorker
					.register(process.env.SWURL)
					.then((reg: ServiceWorkerRegistration) => {
						reg.onupdatefound = () =>
							console.log("[ServiceWorkerClient]", "Service worker found an update", reg);
						console.log("[ServiceWorkerClient]", "Service worker registration succeeded.", reg);
					})
					.catch((error: any) => {
						console.log("[ServiceWorkerClient]", "Service worker registration failed:", error);
					});
			}),
			SettingsAction("Uninstall Service Workers", async () => {
				const registrations = await navigator.serviceWorker.getRegistrations();
				for (const registration of registrations) {
					try {
						console.log("[ServiceWorkerClient]", "Unregistering worker", registration);
						await registration.unregister();
						console.log("[ServiceWorkerClient]", "Unregistering worker succeeded");
					} catch (e) {
						console.log("[ServiceWorkerClient]", "Unregistering worker failed:", e);
					}
				}
			}),
			MenuItemSeparator,
			SettingsAction("Create Test", async () => {
				const TestCreatorWindow = (await import("./components")).TestCreatorWindow;
				const simulator = document.createElement(TestCreatorWindow.tagName) as InstanceType<
					typeof TestCreatorWindow
				>;
				simulator.gameController = gameController;
				simulator.state = localStorage.prefixedWith("simulator");
				gameController.window.manager.showWindow(simulator);
			}),
			SettingsAction("Load Test", loadTest(gameController)),
			MenuItemSeparator,
			SettingsAction("Debug Scripts", async () => {
				const ScriptDebugger = (await import("./script-debugger")).default;

				const windowManager = gameController.window.manager;
				const scriptDebugger = new ScriptDebugger(windowManager);
				scriptDebugger.engine = gameController.engine;
				scriptDebugger.show();
			}),
			SettingsAction(
				"Edit Current Data",
				async () => (await import("src/app/editor")).main(gameController.assets),
				true
			),
			SettingsAction(
				"Edit Game Data...",
				async () => (await import("src/app/editor")).main(),
				true
			),
			SettingsAction(
				"Edit Save Game...",
				async () => (await import("src/app/save-game-editor")).main(gameController.window.manager),
				true
			)
		]
	};
};
