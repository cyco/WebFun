import Slider from "src/ui/components/slider";
import { HTMLElement } from "src/std/dom";

describeComponent(Slider, () => {
	let subject: Slider = null;
	beforeEach(() => (subject = render(Slider) as Slider));

	it("is an html element", () => {
		expect(subject instanceof HTMLElement).toBeTrue();
	});
});
