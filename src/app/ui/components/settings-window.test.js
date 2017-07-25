import SettingsWindow from "./settings-window";
import { Slider } from "/ui/components";

describeComponent(SettingsWindow, () => {
	let subject;
	beforeEach(() => subject = render(SettingsWindow));

	it('shows a slider', () => {
		expect(subject.querySelector(Slider.TagName)).not.toBeNull();
	});
});
