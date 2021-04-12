import { Menu, MenuItemInit, MenuItemSeparator as Separator, MenuItem } from "src/ui";

import { document, window } from "src/std/dom";
import { GameState } from "src/engine";
import { Yoda } from "src/variant";
import { PauseScene } from "src/engine/scenes";
import { Window as WindowComponent } from "src/ui/components";
import { WindowModalSession } from "src/ux";
import buildDebugMenu from "src/app/webfun/debug/menu";
import AboutWindow from "./about-window";
import DifficultyWindow from "./difficulty-window";
import GameController from "../game-controller";
import GameSpeedWindow from "./game-speed-window";
import HelpViewer from "./help-viewer";
import StatisticsWindow from "./statistics-window";
import WorldSizeWindow from "./world-size-window";
import Settings from "src/settings";

function SoundMenuItem(
	controller: GameController,
	name: string,
	settingsName: "playEffects" | "playMusic",
	settings: Settings
): Partial<MenuItemInit> {
	return {
		title: `${name} On`,
		mnemonic: 0,
		enabled: () => controller.engine !== null,
		state: () => (settings[settingsName] ? +1 : +0),
		callback: (): void => void (settings[settingsName] = !settings[settingsName])
	};
}

class MainMenu extends Menu {
	private controller: GameController;

	constructor(controller: GameController, settings: Settings) {
		super([
			{
				title: "File",
				mnemonic: 0,
				submenu: [
					{
						title: "New World",
						mnemonic: 0,
						callback: () => controller.newStory(),
						enabled: () => controller.data !== null
					},
					{
						title: "Replay Story",
						mnemonic: 0,
						callback: () => controller.replayStory(),
						enabled: () => controller.engine !== null
					},
					{
						title: "Load World",
						mnemonic: 0,
						callback: () => controller.load(),
						enabled: () => controller.data !== null,
						beta: true
					},
					{
						title: "Save World",
						mnemonic: 0,
						callback: () => controller.save(),
						enabled: () => controller.engine?.variant === Yoda,
						beta: true
					},
					Separator,
					{
						title: "Exit",
						mnemonic: 1,
						callback: () => controller.exit()
					}
				]
			},
			{
				title: "Options",
				mnemonic: 0,
				submenu: [
					{
						title: "Combat Difficulty...",
						mnemonic: 0,
						callback: () => this._runModalSessionForWindowComponent(DifficultyWindow.tagName)
					},
					{
						title: "Game Speed...",
						callback: () => this._runModalSessionForWindowComponent(GameSpeedWindow.tagName),
						mnemonic: 0
					},
					{
						title: "World Control...",
						callback: () => this._runModalSessionForWindowComponent(WorldSizeWindow.tagName),
						mnemonic: 0
					},
					{
						title: "Statistics...",
						mnemonic: 0,
						callback: () => this._runModalSessionForWindowComponent(StatisticsWindow.tagName)
					},
					Separator,
					SoundMenuItem(controller, "Music", "playMusic", settings),
					SoundMenuItem(controller, "Sound", "playEffects", settings),
					Separator,
					{
						title: "Pause",
						mnemonic: 0,
						enabled: () => controller.engine?.gameState === GameState.Running,
						state: () =>
							controller.engine?.sceneManager?.currentScene instanceof PauseScene
								? MenuItem.State.On
								: MenuItem.State.Off,
						callback: () =>
							controller.engine?.sceneManager?.currentScene instanceof PauseScene
								? controller.engine.sceneManager.popScene()
								: controller.engine.sceneManager.pushScene(new PauseScene())
					}
				]
			},
			{
				title: "Window",
				mnemonic: 0,
				submenu: [
					{
						title: "Hide Me!",
						mnemonic: 0
					}
				]
			},
			{
				title: "Help",
				mnemonic: 0,
				submenu: [
					{
						title: "How to Play",
						callback: () => {
							const helpWindow = document.createElement(HelpViewer.tagName);
							controller.window.manager.showWindow(helpWindow);
							helpWindow.loadHelpFile(controller.gameSource.help);
						},
						enabled: () => controller.gameSource.help?.length > 0,
						mnemonic: 0
					},
					{
						title: "Using Help",
						mnemonic: 0
					},
					{
						title: "Report a Bug",
						mnemonic: 0,
						callback: () => window.open(settings.issueTracker)
					},
					Separator,
					{
						title: "About...",
						mnemonic: 0,
						callback: () => this._runModalSessionForWindowComponent(AboutWindow.tagName)
					}
				]
			},
			...(controller.settings.debug ? [buildDebugMenu(controller)] : [])
		]);

		this.controller = controller;
	}

	private _runModalSessionForWindowComponent(tagName: string) {
		const window = document.createElement(tagName) as WindowComponent;
		this._runModalSession(window);
	}

	private _runModalSession(window: WindowComponent) {
		const session = new WindowModalSession(window);
		window.onclose = () => session.end(0);
		session.runForWindow(this.controller.window);
	}
}

export default MainMenu;
