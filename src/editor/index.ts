import { ComponentRegistry } from "src/ui";
import * as Components from "./components";
import Editor from "./editor";
import GameController from "src/app/game-controller";
import CSSTileSheet from "./css-tile-sheet";
import DataManager from "./data-manager";

const initialize = (gameController: GameController) => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponent(Editor);
};

export { initialize, CSSTileSheet, DataManager };
