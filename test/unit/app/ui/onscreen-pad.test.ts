import OnscreenPad from "src/app/ui/onscreen-pad";
import { Point } from "src/util";
import { InputMask } from "src/engine/input";

xdescribeComponent(OnscreenPad, () => {
	let lastEvent: Event;
	let subject: OnscreenPad;
	beforeEach(() => (subject = render(OnscreenPad) as any));
	afterEach(() => subject.remove());

	it("re-positions the thumb in the center by default", () => {
		expect(thumbPosition()).toEqual({ x: 80, y: 80 });
	});

	describe("visual feedback", () => {
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
	});

	describe("input", () => {
		let box: DOMRect;
		let center: Point;
		beforeEach(() => {
			dispatchEvent("touchstart", 0, 0);
			box = subject.getBoundingClientRect();
			center = new Point(box.left + box.width / 2.0, box.top + box.height / 2.0);
		});

		describe("when the thumb is moved to the left beyond the deadzone", () => {
			beforeEach(() => {
				dispatchEvent("touchmove", center.x - 40, center.y);
			});

			it("is reflected in the input mask", () => {
				expect(subject.input).toBe(InputMask.Left);
			});
		});

		describe("when the thumb is moved to the right beyond the deadzone", () => {
			beforeEach(() => {
				dispatchEvent("touchmove", center.x + 40, center.y);
			});

			it("is reflected in the input mask", () => {
				expect(subject.input).toBe(InputMask.Right);
			});
		});

		describe("when the thumb is moved to the top beyond the deadzone", () => {
			beforeEach(() => {
				dispatchEvent("touchmove", center.x, center.y - 40);
			});

			it("is reflected in the input mask", () => {
				expect(subject.input).toBe(InputMask.Up);
			});
		});

		describe("when the thumb is moved to the bottom beyond the deadzone", () => {
			beforeEach(() => {
				dispatchEvent("touchmove", center.x, center.y + 40);
			});

			it("is reflected in the input mask", () => {
				expect(subject.input).toBe(InputMask.Down);
			});
		});

		describe("when the thumb is moved to the bottom left beyond the deadzone", () => {
			beforeEach(() => {
				dispatchEvent("touchmove", center.x - 40, center.y + 35);
			});

			it("is reflected in the input mask", () => {
				expect(subject.input).toBe(InputMask.Down | InputMask.Left);
			});

			describe("when the thumb is moved even further", () => {
				beforeEach(() => {
					dispatchEvent("touchmove", center.x - 60, center.y + 50);
				});

				it("sets the `walk` flag", () => {
					expect(subject.input).toBe(InputMask.Down | InputMask.Left | InputMask.Walk);
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
