import GameController from "./game-controller";
import { ComponentRegistry, Components } from '/ui';

export default () => {
	ComponentRegistry.sharedRegistry.registerComponents(Components);

	const gameController = new GameController();
	gameController.start();
};
