import Component from "./component";

class ComponentRegistry {
	private static registry: ComponentRegistry;
	private components: {[_: string]: typeof Component} = {};

	static get sharedRegistry() {
		return this.registry || (this.registry = new this());
	}

	registerComponents(components: {[_: string]: Component}|Component[]) {
		Object.values(components)
			.filter(x => x.TagName)
			.forEach(c => this.registerComponent(c));
	}

	registerComponent(ComponentDefinition: typeof Component) {
		console.assert(!!ComponentDefinition.TagName, `ComponentDefinitions must define a tag to be used!`);
		console.assert(!this.components[ComponentDefinition.TagName], `A component with tag '${ComponentDefinition.TagName}' is already registered!`);

		window.customElements.define(ComponentDefinition.TagName, ComponentDefinition, ComponentDefinition.Options);
		this.components[ComponentDefinition.TagName] = ComponentDefinition;
	}
}

export default ComponentRegistry;
