import { ComponentRegistry } from "src/ui";
import * as Components from "./components";
import Editor from "./save-game-editor";
import GameController from "src/app/game-controller";

const initialize = (gameController: GameController) => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponent(Editor);
};

export { initialize };
