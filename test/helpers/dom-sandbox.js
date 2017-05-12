export const sandboxed = (description) => {
	return () => {
		let sand = {
			box: null
		};
		beforeEach(() => {
			global.document = global.doc;
			
			sand.box = global.document.createElement('div');
			sand.box.className = 'sandbox';
			global.document.body.appendChild(sand.box);
		});

		description(sand);

		afterEach(() => {
			global.document.body.removeChild(sand.box);
			sand.box = null;
		});
	};
};

export default sandboxed;