import { ComponentRegistry, Components } from "src/ui";
import GameController from "./game-controller";
import * as AppComponents from "./ui";
import * as WindowComponents from "./windows";
import Settings, { loadSettings } from "src/settings";
import ScriptDebugger from "src/debug/script-debugger";

export default () => {
	loadSettings();

	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponents(<any>AppComponents);
	ComponentRegistry.sharedRegistry.registerComponents(<any>WindowComponents);

	const gameController = new GameController();
	gameController.start();

	if(Settings.debuggerActive) {
		ScriptDebugger.sharedDebugger.show();
	}
};
