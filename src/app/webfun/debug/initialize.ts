import { GameController } from "src/app/webfun/index";
import { ComponentRegistry } from "src/ui";

const initialize = async (gameController?: GameController): Promise<void> => {
	const Components = await import("./components");
	if (!ComponentRegistry.sharedRegistry.contains(Object.values(Components).last())) {
		ComponentRegistry.sharedRegistry.registerComponents(Components);
	}
	const ScriptDebugger = (await import("./script-debugger")).default;

	if (gameController) {
		ScriptDebugger.sharedDebugger.engine = gameController.engine;
	}
	if (gameController && gameController.settings.debuggerActive) {
		ScriptDebugger.sharedDebugger.show();
	}
};

export default initialize;
