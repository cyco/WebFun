import { Menu, MenuItemInit, MenuItemSeparator as Separator } from "src/ui";

import DifficultyWindow from "./difficulty-window";
import GameController from "../game-controller";
import GameSpeedWindow from "./game-speed-window";
import Settings from "src/settings";
import StatisticsWindow from "./statistics-window";
import { Window } from "src/ui/components";
import { WindowModalSession } from "src/ux";
import WorldSizeWindow from "./world-size-window";
import { buildMenu as buildDebugMenu } from "src/debug";
import { document } from "src/std/dom";

function SoundMenuItem(
	controller: GameController,
	name: string,
	settingsName: "playEffects" | "playMusic"
): Partial<MenuItemInit> {
	return {
		title: `${name} On`,
		mnemonic: 0,
		enabled: () => controller.engine !== null,
		state: () => (Settings[settingsName] ? +1 : +0),
		callback: (): void => void (Settings[settingsName] = !Settings[settingsName])
	};
}

class MainMenu extends Menu {
	constructor(controller: GameController) {
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
						enabled: () => controller.engine !== null,
						beta: true
					},
					Separator,
					{
						title: "Exit",
						mnemonic: 1
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
					SoundMenuItem(controller, "Music", "playMusic"),
					SoundMenuItem(controller, "Sound", "playEffects"),
					Separator,
					{
						title: "Pause",
						mnemonic: 0
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
						mnemonic: 0
					},
					{
						title: "Using Help",
						mnemonic: 0
					},
					Separator,
					{
						title: "About...",
						mnemonic: 0
					}
				]
			},
			...(controller.settings.debug ? [buildDebugMenu(controller)] : [])
		]);
	}

	private _runModalSessionForWindowComponent(tagName: string) {
		const window = document.createElement(tagName) as Window;
		this._runModalSession(window);
	}

	private _runModalSession(window: Window) {
		const session = new WindowModalSession(window);
		window.onclose = () => session.end(0);
		session.run();
	}
}

export default MainMenu;
