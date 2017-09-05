import GameController from "./game-controller";
import { ComponentRegistry } from "src/ui";
import * as Components from "src/ui/components";
import * as AppComponents from "./ui/components";
import * as WindowComponents from "./windows";

export default () => {
	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(WindowComponents);

	const gameController = new GameController();
	gameController.start();
};
