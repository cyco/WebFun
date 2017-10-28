import { CompareWorldItems, ComparisonResult, ParseExpectation, PrepareExpectations } from "./expectation";
import Menu from "./menu";
import ScriptDebugger from "./script-debugger";
import Settings from "src/settings";
import { ComponentRegistry } from "src/ui";
import * as Components from "./components";

const initialize = () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);

	if (Settings.debuggerActive) {
		ScriptDebugger.sharedDebugger.show();
	}
};

export {
	initialize,
	ScriptDebugger,
	Menu,
	PrepareExpectations,
	ParseExpectation,
	ComparisonResult,
	CompareWorldItems
};
