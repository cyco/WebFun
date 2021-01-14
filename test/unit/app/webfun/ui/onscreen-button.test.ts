import OnscreenButton from "src/app/webfun/ui/onscreen-button";

describeComponent(OnscreenButton, () => {
	let lastEvent: Event;
	let subject: OnscreenButton;
	beforeEach(() => (subject = render(OnscreenButton) as any));
	afterEach(() => subject.remove());

	describe("when it is touched", () => {
		beforeEach(() => {
			dispatchEvent("touchstart");
		});

		it("is reflected in a css class", () => {
			expect(subject).toHaveClass("pressed");
		});

		it("is reflected in a property", () => {
			expect(subject.pressed).toBeTrue();
		});

		it("prevents default actions of the event in order to prevent accidental scrolling", () => {
			expect(lastEvent.defaultPrevented).toBeTrue();
		});

		describe("and the touch is canceled", () => {
			beforeEach(() => {
				dispatchEvent("touchcancel");
			});

			it("does not have the `pressed` class anymore", () => {
				expect(subject).not.toHaveClass("pressed");
			});

			it("is reflected in a property", () => {
				expect(subject.pressed).toBeFalse();
			});

			it("prevents default actions of the event in order to prevent accidental scrolling", () => {
				expect(lastEvent.defaultPrevented).toBeTrue();
			});
		});

		describe("and the touch ends", () => {
			beforeEach(() => {
				dispatchEvent("touchend");
			});

			it("does not have the `pressed` class anymore", () => {
				expect(subject).not.toHaveClass("pressed");
			});

			it("prevents default actions of the event in order to prevent accidental scrolling", () => {
				expect(lastEvent.defaultPrevented).toBeTrue();
			});
		});
	});

	describe("when it is removed from the dom", () => {
		beforeEach(() => {
			subject.remove();
		});

		it("does not listen for events anymore", () => {
			dispatchEvent("touchstart");
			expect(subject).not.toHaveClass("pressed");
		});
	});

	function dispatchEvent(name: string): void {
		lastEvent = new CustomEvent(name, { cancelable: true });
		subject.dispatchEvent(lastEvent);
	}
});
