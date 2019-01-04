import { CompareWorldItems, ComparisonResult, ParseExpectation, PrepareExpectations } from "./expectation";
import buildMenu from "./menu";
import ScriptDebugger from "./script-debugger";
import { ComponentRegistry } from "src/ui";
import * as Components from "./components";
import GameController from "src/app/game-controller";

const initialize = (gameController: GameController) => {
	ComponentRegistry.sharedRegistry.registerComponents(Components);

	ScriptDebugger.sharedDebugger.engine = gameController.engine;
	if (gameController.settings.debuggerActive) {
		ScriptDebugger.sharedDebugger.show();
	}
};

export {
	initialize,
	ScriptDebugger,
	buildMenu,
	PrepareExpectations,
	ParseExpectation,
	ComparisonResult,
	CompareWorldItems
};
