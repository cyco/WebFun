import Window from "src/ui/components/window";
import WindowTitlebar from "src/ui/components/window-titlebar";

import { describeComponent } from "../../../helpers/component";

describeComponent(Window, () => {
	let subject;
	beforeEach(() => (subject = render(Window)));

	it("displays what is known as a window in the desktop world", () => {
		expect(subject.querySelector(WindowTitlebar.tagName)).not.toBeNull();
	});
});
