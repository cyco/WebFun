import { buildMenu as buildDebugMenu } from "src/debug";
import Settings from "src/settings";
import { Menu, MenuItemSeparator as Separator } from "src/ui";
import { WindowModalSession } from "src/ux";
import { document } from "src/std.dom";
import Window from "../../ui/components/window";
import GameController from "../game-controller";
import DifficultyWindow from "./difficulty-window";
import GameSpeedWindow from "./game-speed-window";
import StatisticsWindow from "./statistics-window";
import WorldSizeWindow from "./world-size-window";

class MainMenu extends Menu {
	constructor(gameController: GameController) {
		const menuItems: any[] = [
			{
				title: "File",
				mnemonic: 0,
				submenu: [
					{
						title: "New World",
						mnemonic: 0,
						callback: () => gameController.newStory(),
						enabled: () => gameController.isDataLoaded()
					},
					{
						title: "Replay Story",
						mnemonic: 0,
						callback: () => gameController.replayStory(),
						enabled: () => gameController.isGameInProgress()
					},
					{
						title: "Load World",
						mnemonic: 0,
						callback: () => gameController.load(),
						enabled: () => gameController.isDataLoaded()
					},
					{
						title: "Save World",
						mnemonic: 0,
						callback: () => gameController.save(),
						enabled: () => gameController.isGameInProgress()
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
						callback: () =>
							this._runModalSessionForWindowComponent(DifficultyWindow.tagName)
					},
					{
						title: "Game Speed...",
						callback: () =>
							this._runModalSessionForWindowComponent(GameSpeedWindow.tagName),
						mnemonic: 0
					},
					{
						title: "World Control...",
						callback: () =>
							this._runModalSessionForWindowComponent(WorldSizeWindow.tagName),
						mnemonic: 0
					},
					{
						title: "Statistics...",
						mnemonic: 0,
						callback: () =>
							this._runModalSessionForWindowComponent(StatisticsWindow.tagName)
					},
					Separator,
					{
						title: "Music On",
						mnemonic: 0
					},
					{
						title: "Sound On",
						mnemonic: 0
					},
					Separator,
					{
						title: "Pause",
						mnemonic: 0,
						enabled: () => gameController.isGameInProgress()
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
			}
		];

		if (Settings.debug) menuItems.push(buildDebugMenu(gameController));

		super(menuItems);
	}

	_runModalSessionForWindowComponent(tagName: string) {
		const window = <Window>document.createElement(tagName);
		this._runModalSession(window);
	}

	_runModalSession(window: Window) {
		const session = new WindowModalSession(window);
		window.onclose = () => session.end(0);
		session.run();
	}
}

export default MainMenu;
