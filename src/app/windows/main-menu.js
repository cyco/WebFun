import { Menu, MenuItemSeparator as Separator } from "/ui";
import { WindowModalSession } from "/ux";

import StatisticsWindow from "./statistics-window";

export default class extends Menu {
	constructor(gameController) {
		super([{
			title: "File",
			mnemonic: 0,
			submenu: [{
				title: "New World",
				mnemonic: 0,
				callback: () => gameController.newStory(),
				enabled: () => gameController.isDataLoaded(),
			}, {
				title: "Replay Story",
				mnemonic: 0,
				callback: () => gameController.replayStory(),
				enabled: () => gameController.isGameInProgress(),
			}, {
				title: "Load World",
				mnemonic: 0,
				callback: () => gameController.load(),
				enabled: () => gameController.isDataLoaded(),
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
				mnemonic: 0
			}, {
				title: "Game Speed...",
				mnemonic: 0
			}, {
				title: "World Control...",
				mnemonic: 0
			}, {
				title: "Statistics...",
				mnemonic: 0,
				callback: () => this._runModalSession(new StatisticsWindow())
			}, Separator, {
				title: "Music On",
				mnemonic: 0,
			}, {
				title: "Sound On",
				mnemonic: 0,
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
		}]);
	}

	_runModalSession(window) {
		const session = new WindowModalSession(window);
		window.onclose = () => session.end();
		session.run();
	}
}
