import { ComponentRegistry } from "src/ui";

const initialize = async (): Promise<void> => {
	const Components = await import("./components");
	if (!ComponentRegistry.sharedRegistry.contains(Object.values(Components).last())) {
		ComponentRegistry.sharedRegistry.registerComponents(Components);
	}
};

export default initialize;
