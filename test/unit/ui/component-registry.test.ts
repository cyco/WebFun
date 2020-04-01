import ComponentRegistry from "src/ui/component-registry";
import { Component } from "src/ui";

describe("WebFun.UI.ComponentRegistry", () => {
	it("is a class", () => {
		expect(ComponentRegistry).toBeClass();
		expect(ComponentRegistry.sharedRegistry).toBeInstanceOf(ComponentRegistry);
	});

	it("has methods to register single or multiple components", () => {
		expect(ComponentRegistry.sharedRegistry).toHaveMethod("registerComponent");
		expect(ComponentRegistry.sharedRegistry).toHaveMethod("registerComponents");
	});

	describe("registerComponent", () => {
		it("passes the call on to customElements ", () => {
			const componentMock: typeof Component = { tagName: "test-component-1" } as any;
			spyOn(window.customElements, "define");
			const subject = new ComponentRegistry();
			subject.registerComponent(componentMock);
			expect(window.customElements.define).toHaveBeenCalledWith("test-component-1", componentMock);
		});
	});

	describe("registerComponents", () => {
		it("can be called using an object of components", () => {
			const components: { [_: string]: typeof Component } = {
				"test-component-1": { tagName: "test-component-1" },
				"test-component-2": { tagName: "test-component-2" }
			} as any;
			spyOn(window.customElements, "define");

			const subject = new ComponentRegistry();
			subject.registerComponents(components);
			expect((window.customElements.define as any).calls.count()).toEqual(2);
		});

		it("can be called using an array of components", () => {
			const components: typeof Component[] = [
				{ tagName: "test-component-1" },
				{ tagName: "test-component-2" }
			] as any;
			spyOn(window.customElements, "define");

			const subject = new ComponentRegistry();
			subject.registerComponents(components);
			expect((window.customElements.define as any).calls.count()).toEqual(2);
		});
	});
});
