import GameController from "./game-controller";
import { ComponentRegistry, Components } from '/ui';
import { Components as AppComponents } from './ui';

export default () => {
	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);

	const gameController = new GameController();
	gameController.start();
};
