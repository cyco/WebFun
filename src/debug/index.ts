import { CompareWorldItems, ComparisonResult, ParseExpectation, PrepareExpectations } from "./expectation";
import Menu from "./menu";
import ScriptDebugger from "./script-debugger";
import Settings from "src/settings";

const initialize = () => {
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
