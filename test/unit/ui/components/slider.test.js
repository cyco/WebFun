import Slider from "src/ui/components/slider";
import { HTMLElement } from "std.dom";

describeComponent(Slider, () => {
	let subject = null;
	beforeEach(() => subject = render(Slider));

	it("is an html element", () => {
		expect(subject instanceof HTMLElement).toBeTrue();
	});
});
