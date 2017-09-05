import { Menu, MenuItemSeparator as Separator } from "src/ui";
import { WindowModalSession } from "src/ux";
import Settings from "src/settings";
import { Menu as DebugMenu } from "src/debug";
import StatisticsWindow from "./statistics-window";
import DifficultyWindow from "./difficulty-window";
import GameSpeedWindow from "./game-speed-window";

export default class extends Menu {
	constructor(gameController) {
		const menuItems = [{
			title: "File",
			mnemonic: 0,
			submenu: [{
				title: "New World",
				mnemonic: 0,
				callback: () => gameController.newStory(),
				enabled: () => gameController.isDataLoaded()
			}, {
				title: "Replay Story",
				mnemonic: 0,
				callback: () => gameController.replayStory(),
				enabled: () => gameController.isGameInProgress()
			}, {
				title: "Load World",
				mnemonic: 0,
				callback: () => gameController.load(),
				enabled: () => gameController.isDataLoaded()
			}, {
				title: "Save World",
				mnemonic: 0,
				callback: () => gameController.save(),
				enabled: () => gameController.isGameInProgress()
			},
				Separator, {
					title: "Exit",
					mnemonic: 1
				}
			]
		}, {
			title: "Options",
			mnemonic: 0,
			submenu: [{
				title: "Combat Difficulty...",
				mnemonic: 0,
				callback: () => this._runModalSession(document.createElement(DifficultyWindow.TagName))
			}, {
				title: "Game Speed...",
				callback: () => this._runModalSession(document.createElement(GameSpeedWindow.TagName)),
				mnemonic: 0
			}, {
				title: "World Control...",
				mnemonic: 0
			}, {
				title: "Statistics...",
				mnemonic: 0,
				callback: () => this._runModalSession(document.createElement(StatisticsWindow.TagName))
			}, Separator, {
				title: "Music On",
				mnemonic: 0
			}, {
				title: "Sound On",
				mnemonic: 0
			},
				Separator, {
					title: "Pause",
					mnemonic: 0,
					enabled: () => gameController.isGameInProgress()
				}
			]
		}, {
			title: "Window",
			mnemonic: 0,
			submenu: [{
				title: "Hide Me!",
				mnemonic: 0
			}]
		}, {
			title: "Help",
			mnemonic: 0,
			submenu: [{
				title: "How to Play",
				mnemonic: 0
			}, {
				title: "Using Help",
				mnemonic: 0
			}, Separator, {
				title: "About...",
				mnemonic: 0
			}]
		}];

		if (Settings.debug) menuItems.push(DebugMenu);

		super(menuItems);
	}

	_runModalSession(window) {
		const session = new WindowModalSession(window);
		window.onclose = () => session.end();
		session.run();
	}
}
