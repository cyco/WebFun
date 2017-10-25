import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui/components";
import * as WindowComponents from "./windows";
import { loadSettings } from "src/settings";

export default () => {
	loadSettings();

	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponents(<any>AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(<any>WindowComponents);

	const gameController = new GameController();
	gameController.start();
};
