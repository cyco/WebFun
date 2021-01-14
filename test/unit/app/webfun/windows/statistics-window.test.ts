import StatisticsWindow from "src/app/webfun/windows/statistics-window";
import Textbox from "src/ui/components/textbox";

describeComponent(StatisticsWindow, () => {
	let subject: StatisticsWindow;
	beforeEach(() => (subject = render(StatisticsWindow) as any));

	it("renders serveral text boxes", () => {
		expect(subject.querySelector(Textbox.tagName)).not.toBeNull();
	});
});
