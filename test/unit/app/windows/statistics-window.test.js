import StatisticsWindow from "src/app/windows/statistics-window";
import Textbox from "src/ui/components/textbox";

describeComponent(StatisticsWindow, () => {
	let subject;
	beforeEach(() => (subject = render(StatisticsWindow)));

	it("renders serveral text boxes", () => {
		expect(subject.querySelector(Textbox.TagName)).not.toBeNull();
	});
});
