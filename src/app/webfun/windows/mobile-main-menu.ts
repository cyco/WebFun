import { Menu, MenuItemInit, MenuItemSeparator as Separator } from "src/ui";

import GameController from "../game-controller";
import Settings from "src/settings";
import { Window as WindowComponent } from "src/ui/components";
import { WindowModalSession } from "src/ux";
import buildDebugMenu from "src/app/webfun/debug/menu";
import { document, window } from "src/std/dom";

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

class MobileMainMenu extends Menu {
	constructor(controller: GameController) {
		super([
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
				title: "Options",
				mnemonic: 0,
				submenu: [
					{ title: "Diffculty" },
					{ title: "Game Speed" },
					{ title: "World Size" },
					Separator,
					{ title: "Music" },
					{ title: "Sound" }
				]
			},
			{
				title: "Statistics...",
				mnemonic: 0,
				submenu: [
					{ title: "High Score" },
					{ title: "Last Score" },
					{ title: "Games Won" },
					{ title: "Games Lost" }
				]
			},
			SoundMenuItem(controller, "Sound", "playEffects"),

			Separator,
			{
				title: "How to Play",
				mnemonic: 0
			},
			{
				title: "Report a Bug",
				mnemonic: 0,
				callback: () => window.open(Settings.issueTracker)
			},
			...(controller.settings.debug ? [buildDebugMenu(controller)] : [])
		]);
	}

	private _runModalSessionForWindowComponent(tagName: string) {
		const window = document.createElement(tagName) as WindowComponent;
		this._runModalSession(window);
	}

	private _runModalSession(window: WindowComponent) {
		const session = new WindowModalSession(window);
		window.onclose = () => session.end(0);
		session.run();
	}
}

export default MobileMainMenu;
