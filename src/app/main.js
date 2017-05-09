import GameController from "./game-controller";
import { ComponentRegistry, Components } from '/ui';
import { Components as AppComponents } from './ui';
import { MainWindow, StatisticsWindow} from './windows';

export default () => {
	ComponentRegistry.sharedRegistry.registerComponents(Components);
	ComponentRegistry.sharedRegistry.registerComponents(AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents({
		MainWindow, StatisticsWindow
	});

	const gameController = new GameController();
	gameController.start();
};
