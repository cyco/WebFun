import { Menu, MenuItem, MenuItemInit, MenuItemSeparator as Separator } from "src/ui";

import GameController from "../game-controller";
import Settings from "src/settings";
import buildDebugMenu from "src/app/webfun/debug/menu";
import { window } from "src/std/dom";

function SoundMenuItem(
	controller: GameController,
	name: string,
	settingsName: "playEffects" | "playMusic",
	settings: Settings
): Partial<MenuItemInit> {
	return {
		title: `${name}`,
		mnemonic: 0,
		enabled: () => controller.engine !== null,
		state: () => (settings[settingsName] ? MenuItem.State.On : MenuItem.State.Off),
		callback: (): void => {
			settings[settingsName] = !settings[settingsName];
		}
	};
}

class MobileMainMenu extends Menu {
	constructor(controller: GameController, settings: Settings) {
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
					{ title: "Difficulty" },
					{ title: "Game Speed" },
					{ title: "World Size" },
					Separator,
					SoundMenuItem(controller, "Play Music", "playMusic", settings),
					SoundMenuItem(controller, "Play Effects", "playEffects", settings)
				]
			},
			{
				title: "Statistics",
				mnemonic: 0,
				submenu: [
					{ title: "High Score" },
					{ title: "Last Score" },
					{ title: "Games Won" },
					{ title: "Games Lost" }
				]
			},

			Separator,
			{
				title: "Report a Bug",
				mnemonic: 0,
				callback: () => window.open(settings.issueTracker)
			},
			...(controller.settings.debug ? [buildDebugMenu(controller)] : []),

			Separator,
			{
				title: "Leave",
				mnemonic: 0,
				callback: () => controller.exit()
			}
		]);
	}
}

export default MobileMainMenu;
