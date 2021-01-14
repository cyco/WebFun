import FullscreenMenu from "src/app/webfun/ui/fullscreen-menu";
import { sleep } from "src/util";

describeComponent(FullscreenMenu, () => {
	let subject: FullscreenMenu;

	describe("when shown", () => {
		let container: HTMLElement;
		beforeEach(async () => {
			subject = render(FullscreenMenu);
			container = subject.parentElement;

			// wait for menu to do its timeout hacks
			await sleep();
		});
		afterEach(async () => {
			subject.remove();

			// wait for menu to do its timeout hacks again
			await sleep();
		});

		it("marks the parent element", () => {
			expect(subject.parentElement.hasAttribute("fs-menu-open")).toBeTrue();
		});

		describe("when it is closed", () => {
			beforeEach(() => subject.close());

			it("removes the attribute from its parent element", () => {
				expect(container.hasAttribute("fs-menu-open")).toBeFalse();
			});
		});
	});
});
