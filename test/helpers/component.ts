import Component from "src/ui/component";

const buildName = (tagName: string) =>
	tagName
		.substr(tagName.indexOf("-") + 1)
		.slice()
		.split("-")
		.map(p => p[0].toUpperCase() + p.substr(1))
		.join("");

const makeFunction = (desc: Function) => (
	ComponentDefinition: typeof Component,
	block: Function
) => {
	desc(`WebFun.UI.Component ${buildName(ComponentDefinition.tagName || "")}`, () => {
		beforeAll(() => customElements.define(ComponentDefinition.tagName, ComponentDefinition));
		block();
	});
};

export const describeComponent = makeFunction(describe);
export const xdescribeComponent = makeFunction(xdescribe);
export const fdescribeComponent = makeFunction(fdescribe);
