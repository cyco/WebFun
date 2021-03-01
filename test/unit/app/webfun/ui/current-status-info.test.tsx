import { Engine } from "src/engine";
import CurrentStatusInfo from "src/app/webfun/ui/current-status-info";
import { describeComponent } from "test/helpers";
import { Point } from "src/util";
import { Button } from "src/ui/components";

describeComponent(CurrentStatusInfo, () => {
	let subject: CurrentStatusInfo;
	let mockEngine: Engine;

	describe("when attached to the dom", () => {
		beforeAll(() => {
			mockEngine = {
				currentZone: { id: 5 },
				hero: { location: new Point(6, 7) },
				story: { goal: { id: 8 } }
			} as any;
			subject = render(<CurrentStatusInfo engine={mockEngine}></CurrentStatusInfo>);
		});

		it("shows the current zone id", () => {
			expect(subject.textContent).toContain("5");
		});

		it("shows the hero's location", () => {
			expect(subject.textContent).toContain("6");
			expect(subject.textContent).toContain("7");
		});

		it("shows the current goal id", () => {
			expect(subject.textContent).toContain("8");
		});

		it("does not show 'undefined' if a value is missing", () => {
			mockEngine = {
				currentZone: null,
				hero: null,
				story: null
			} as any;
			subject = render(<CurrentStatusInfo engine={mockEngine}></CurrentStatusInfo>);

			expect(subject.textContent).not.toContain("undefined");
			expect(subject.textContent).not.toContain("null");
			expect(subject.textContent).not.toContain("NaN");
		});

		it("shows a button that closes the window when clicked", () => {
			spyOn(subject, "close");
			const button = subject.querySelector(Button.tagName) as Button;
			expect(button.label).toBe("OK");
			button.click();
			expect(subject.close).toHaveBeenCalled();
		});
	});
});
