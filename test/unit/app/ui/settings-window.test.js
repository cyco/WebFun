import SettingsWindow from "src/app/ui/settings-window";
import { Slider } from "src/ui/components";

describeComponent(SettingsWindow, () => {
	let subject;
	beforeEach(() => (subject = render(SettingsWindow)));

	it("shows a slider", () => {
		expect(subject.querySelector(Slider.tagName)).not.toBeNull();
	});
});
