import sandboxed from "test-helpers/dom-sandbox";
import Selector from "/ui/selector";

describe("Selector", sandboxed((sand) => {
	let selector;
	it("displays a drop down menu with a selection", () => {
		selector = new Selector();
		sand.box.appendChild(selector.element);
		expect(sand.box.querySelector("select")).not.toBe(0);
	});

	it("has a method to add options", () => {
		selector.addOption("label", "value");
		selector.addOption("test", 10);
		selector.addOption("labelAndValue");

		expect(selector.element.querySelectorAll("option").length).toBe(3);
	});

	it("has a method to remove an option by value", () => {
		selector.removeOption("value");

		let optionNodes = selector.element.querySelectorAll("option");

		expect(optionNodes.length).toBe(2);
		expect(optionNodes[0].value).toBe("10");
		expect(optionNodes[1].value).toBe("labelAndValue");
	});

	it("has an onchange callback", () => {
		let callback = () => {
			console.log("selection changed");
		};
		selector.onchange = callback;
		expect(selector.onchange).toBe(callback);
	});

	it("can return the currently selected value", () => {
		expect(selector.value).toBe("10");
	});
}));
