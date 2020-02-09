import OnscreenPad from "src/app/ui/onscreen-pad";
import { Point } from "src/util";

describeComponent(OnscreenPad, () => {
	let lastEvent: Event;
	let subject: OnscreenPad;
	beforeEach(() => (subject = render(OnscreenPad) as any));
	afterEach(() => subject.remove());

	it("re-positions the thumb in the center by default", () => {
		expect(thumbPosition()).toEqual({ x: 80, y: 80 });
	});

	describe("when it is touched", () => {
		beforeEach(() => {
			dispatchEvent("touchstart", 0, 0);
		});

		it("prevents default actions of the event in order to prevent accidental scrolling", () => {
			expect(lastEvent.defaultPrevented).toBeTrue();
		});

		describe("and the touches move", () => {
			beforeEach(() => {
				dispatchEvent("touchmove", 50, 75);
			});

			it("re-positions the thumb", () => {
				expect(thumbPosition()).toEqual({ x: 10, y: 10 });
			});

			it("prevents default actions of the event in order to prevent accidental scrolling", () => {
				expect(lastEvent.defaultPrevented).toBeTrue();
			});

			describe("and the touches move some more", () => {
				beforeEach(() => {
					dispatchEvent("touchmove", 100, 120);
				});

				it("re-positions the thumb", () => {
					expect(thumbPosition()).toEqual({ x: 46, y: 42 });
				});
			});

			describe("and the touch ends", () => {
				beforeEach(() => {
					dispatchEvent("touchend", 50, 50);
				});

				it("the thumb is moved back to its initial position", () => {
					expect(thumbPosition()).toEqual({ x: 80, y: 80 });
				});

				it("prevents default actions of the event in order to prevent accidental scrolling", () => {
					expect(lastEvent.defaultPrevented).toBeTrue();
				});
			});
		});
	});

	function dispatchEvent(name: string, x: number = null, y: number = null): void {
		lastEvent = new CustomEvent(name, { cancelable: true });
		(lastEvent as any).touches = [{ clientX: x, clientY: y }];
		subject.dispatchEvent(lastEvent);
	}

	function thumbPosition() {
		const thumbNode = subject.querySelectorAll("svg")[1];

		return { x: parseInt(thumbNode.style.left), y: parseInt(thumbNode.style.top) };
	}
});
