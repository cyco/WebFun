import { CompareSectors, ComparisonResult, ParseExpectation, PrepareExpectations } from "./expectation";
import buildMenu from "./menu";
import ScriptDebugger from "./script-debugger";
import { ComponentRegistry } from "src/ui";
import * as Components from "./components";
import GameController from "src/app/game-controller";
import SimulatedStory from "./simulated-story";
import PuzzleDependencyGraph from "./puzzle-dependency-graph";

const initialize = (gameController?: GameController) => {
	ComponentRegistry.sharedRegistry.registerComponents(Components);

	if (gameController) {
		ScriptDebugger.sharedDebugger.engine = gameController.engine;
	}
	if (gameController && gameController.settings.debuggerActive) {
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
	CompareSectors,
	SimulatedStory,
	PuzzleDependencyGraph
};
