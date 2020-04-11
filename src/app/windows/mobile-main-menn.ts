import { Menu, MenuItemInit, MenuItemSeparator as Separator, MenuItem } from "src/ui";

import DifficultyWindow from "./difficulty-window";
import GameController from "../game-controller";
import GameSpeedWindow from "./game-speed-window";
import Settings from "src/settings";
import StatisticsWindow from "./statistics-window";
import { Window as WindowComponent } from "src/ui/components";
import { WindowModalSession } from "src/ux";
import WorldSizeWindow from "./world-size-window";
import buildDebugMenu from "src/debug/menu";
import { document } from "src/std/dom";
import { GameState } from "src/engine";
import { PauseScene } from "src/engine/scenes";

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

export default MainMenu;
