import ComponentRegistry from "../../../src/ui/component-registry";

describe("ComponentRegistry", () => {
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
			const componentMock = { tagName: "test-component-1" };
			spyOn(window.customElements, "define");
			let subject = new ComponentRegistry();
			subject.registerComponent(componentMock);
			expect(window.customElements.define).toHaveBeenCalledWith("test-component-1", componentMock);
		});
	});

	describe("registerComponents", () => {
		it("can be called using an object of components", () => {
			const components = {
				"test-component-1": { tagName: "test-component-1" },
				"test-component-2": { tagName: "test-component-2" }
			};
			spyOn(window.customElements, "define");

			let subject = new ComponentRegistry();
			subject.registerComponents(components);
			expect(window.customElements.define.calls.count()).toEqual(2);
		});

		it("can be called using an array of components", () => {
			const components = [{ tagName: "test-component-1" }, { tagName: "test-component-2" }];
			spyOn(window.customElements, "define");

			let subject = new ComponentRegistry();
			subject.registerComponents(components);
			expect(window.customElements.define.calls.count()).toEqual(2);
		});
	});
});
