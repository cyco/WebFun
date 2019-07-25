import { document } from "src/std/dom";

interface Sandbox {
	box: HTMLDivElement;
}

export const sandboxed = (description: (sand: Sandbox) => void) => {
	return () => {
		const sand = {
			box: null as HTMLDivElement
		};
		beforeEach(() => {
			sand.box = document.createElement("div");
			sand.box.className = "sandbox";
			document.body.appendChild(sand.box);
		});

		description(sand);

		afterEach(() => {
			document.body.removeChild(sand.box);
			sand.box = null;
		});
	};
};

export default sandboxed;
