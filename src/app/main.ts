import { ComponentRegistry } from "src/ui";
import * as Components from "src/ui/components";
import GameController from "./game-controller";
import * as AppComponents from "./ui/components";
import * as WindowComponents from "./windows";

export default () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponents(<any>AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(<any>WindowComponents);

	const gameController = new GameController();
	gameController.start();
};
