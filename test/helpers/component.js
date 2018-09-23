const buildName = tagName =>
	tagName
		.substr(tagName.indexOf("-") + 1)
		.slice()
		.split("-")
		.map(p => p[0].toUpperCase() + p.substr(1))
		.join("");

const makeFunction = desc => (Component, block) => {
	desc(`WebFun.Unit.UI.Component ${buildName(Component.tagName || "")}`, () => {
		beforeAll(() => customElements.define(Component.tagName, Component, Component.options));
		block();
	});
};

export const describeComponent = makeFunction(describe);
export const xdescribeComponent = makeFunction(xdescribe);
export const fdescribeComponent = makeFunction(fdescribe);
