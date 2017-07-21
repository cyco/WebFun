import { document } from "std.dom";

export const sandboxed = (description) => {
	return () => {
		let sand = {
			box: null
		};
		beforeEach(() => {
			sand.box = document.createElement('div');
			sand.box.className = 'sandbox';
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
