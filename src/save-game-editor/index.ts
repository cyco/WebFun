import SaveGameEditor from "./save-game-editor";
import * as Components from "./components";
import { GameController } from "src/app";
import { ComponentRegistry } from "src/ui";

const initialize = (gameController: GameController) => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponent(SaveGameEditor);
};

export { initialize, SaveGameEditor };
