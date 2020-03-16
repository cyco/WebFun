import { GameController } from "src/app";
import { ComponentRegistry } from "src/ui";

const initialize = async (gameController?: GameController) => {
	const Components = await import("./components");
	ComponentRegistry.sharedRegistry.registerComponents(Components);
	const ScriptDebugger = (await import("./script-debugger")).default;

	if (gameController) {
		ScriptDebugger.sharedDebugger.engine = gameController.engine;
	}
	if (gameController && gameController.settings.debuggerActive) {
		ScriptDebugger.sharedDebugger.show();
	}
};

export default initialize;
