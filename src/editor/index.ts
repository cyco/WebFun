import Menu from "./menu";
import { ComponentRegistry } from "src/ui";
import * as Components from "./components";

const initialize = () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
};

export { initialize, Menu };
