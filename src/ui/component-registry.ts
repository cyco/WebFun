import Component from "./component";

class ComponentRegistry {
	private static registry: ComponentRegistry;
	private components: { [_: string]: typeof Component } = {};

	static get sharedRegistry() {
		return this.registry || (this.registry = new this());
	}

	public registerComponents(components: { [_: string]: typeof Component } | typeof Component[]) {
		Object.values(components)
			.filter(x => x.tagName)
			.forEach(c => this.registerComponent(c));
	}

	public registerComponent(ComponentDefinition: typeof Component) {
		console.assert(!!ComponentDefinition.tagName, `ComponentDefinitions must define a tag to be used!`);
		console.assert(
			!this.components[ComponentDefinition.tagName],
			`A component with tag '${ComponentDefinition.tagName}' is already registered!`
		);

		try {
			window.customElements.define(ComponentDefinition.tagName, ComponentDefinition);
			this.components[ComponentDefinition.tagName] = ComponentDefinition;
		} catch (e) {
			console.info(`Could not register component ${ComponentDefinition.tagName}`);
		}
	}

	public contains(ComponentDefinition: typeof Component): boolean {
		return !!this.components[ComponentDefinition.tagName];
	}
}

export default ComponentRegistry;
