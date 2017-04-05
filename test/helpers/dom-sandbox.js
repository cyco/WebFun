export default (description) => {
	return () => {
		let sand = {
			box: null
		};
		beforeEach(() => {
			global.document = global.doc;
			
			sand.box = document.createElement('div');
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
