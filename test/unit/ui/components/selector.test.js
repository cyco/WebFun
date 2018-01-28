import Selector from "src/ui/components/selector";

describeComponent(Selector, () => {
	let selector;
	beforeEach(() => (selector = render(Selector)));

	it("is class that displays a drop down menu with a selection", () => {
		expect(Selector).toBeClass();
	});

	it("has a method to add options", () => {
		selector.addOption("label", "value");
		selector.addOption("test", 10);
		selector.addOption("labelAndValue");

		expect(selector.querySelectorAll("option").length).toBe(3);
	});

	it("has a method to remove an option by value", () => {
		selector.addOption("label", "value");
		selector.addOption("test", 10);
		selector.addOption("labelAndValue");

		selector.removeOption("value");

		let optionNodes = selector.querySelectorAll("option");

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
		selector.addOption("label", "value");

		expect(selector.value).toBe("value");
	});
});
