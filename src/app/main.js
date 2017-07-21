import GameController from "./game-controller";
import { ComponentRegistry } from "/ui";
import * as Components from "/ui/components";
import * as AppComponents from "./ui/components";
import { MainWindow, StatisticsWindow } from "./windows";

export default () => {
	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents({
		MainWindow, StatisticsWindow
	});

	const gameController = new GameController();
	gameController.start();
};
