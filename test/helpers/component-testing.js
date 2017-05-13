export const render = (component, attributes = {}) => {
	const node = document.createElement(component.tagName);
	Object.keys(attributes).forEach(attr => node.setAttribute(attr, attributes[attr]));
	document.body.appendChild(node);
	return node;
};
// global.render = render;

const makeDescribe = (fn) => (text, component, block) => {
	fn(text, () => {
		beforeAll(() => {
			global.injectCustomElements(global.window);
			global.customElements.define(component.TagName, component);
		});

		// afterEach(() => Array.from(document.querySelectorAll(component.tagName)).forEach(n => n.remove()));

		block();
	});
};

export const describeComponent = makeDescribe(describe);
// global.describeComponent = describeComponent;

export const fdescribeComponent = makeDescribe(fdescribe);
// global.fdescribeComponent = fdescribeComponent;

export const xdescribeComponent = makeDescribe(xdescribe);
// global.xdescribeComponent = xdescribeComponent;
