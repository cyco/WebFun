import PopoverModalSession from "src/ux/popover-modal-session";
import { ModalSession } from "src/ux";
import { Popover } from "src/ui/components";

describe("WebFun.UX.PopoverModalSession", () => {
	let subject: PopoverModalSession;
	let popover: Popover;
	it("is a modal session that shows a popover", () => {
		expect(PopoverModalSession).toBeAClass();
		expect(new PopoverModalSession({} as any)).toBeInstanceOf(ModalSession);
	});

	describe("when it is run", () => {
		beforeEach(() => {
			popover = document.createElement("popover-mock") as any;
			subject = new PopoverModalSession(popover);

			subject.run();
		});

		afterEach(async () => await subject.end(1));

		it("shows the popover", () => {
			expect(document.querySelector("popover-mock")).not.toBeFalsy();
		});

		describe("and the session stops", () => {
			beforeEach(async () => await subject.end(0));

			it("removes the popover from the DOM", async () => {
				expect(document.querySelector("popover-mock")).toBeFalsy();
			});
		});
	});
});
