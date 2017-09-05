export default class {
	static get sharedRegistry() {
		return this.registry || (this.registry = new this());
	}

	constructor() {
		this.components = {};
	}

	registerComponents(components) {
		Object.values(components)
			.filter(x => x.TagName)
			.forEach(c => this.registerComponent(c));
	}

	registerComponent(Component) {
		console.assert(Component.TagName, `Components must define a tag to be used!`);
		console.assert(!this.components[ Component.TagName ], `A component with tag '${Component.TagName}' is already registered!`);

		customElements.define(Component.TagName, Component, Component.Options);
		this.components[ Component.TagName ] = Component;
	}
}
