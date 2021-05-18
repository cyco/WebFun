import PropertyChangeEvent from "src/util/property-change-event";
import observable from "src/util/observable";

describe("WebFun.Util.Observable", () => {
	it("is a function that wraps an object so it sends property change events", () => {
		expect(observable).toBeInstanceOf(Function);
	});

	describe("when an object is wrapped", () => {
		let subject: any & EventTarget;

		beforeEach(() => {
			subject = observable({ a: 2, b: 5 });
		});

		describe("and a listener is registered", () => {
			let listener: Function;

			beforeEach(() => {
				listener = jasmine.createSpy();
				subject.addEventListener(PropertyChangeEvent.type, listener);
			});

			describe("and a property is changed", () => {
				beforeEach(() => {
					subject.a = 5;
				});

				it("sends a PropertyChangeEvent", () => {
					expect(listener).toHaveBeenCalledWith(jasmine.any(PropertyChangeEvent));
				});
			});

			describe("and the listener is removed", () => {
				beforeEach(() => {
					subject.removeEventListener(PropertyChangeEvent.type, listener);
				});

				describe("and a property is changed", () => {
					beforeEach(() => {
						subject.a = 5;
					});

					it("does not send a PropertyChangeEvent", () => {
						expect(listener).not.toHaveBeenCalledWith(jasmine.any(PropertyChangeEvent));
					});
				});
			});

			afterEach(() => {
				subject.removeEventListener(PropertyChangeEvent.type, listener);
			});
		});

		it("makes sure the object can be fully used as an EventTarget", () => {
			expect(() => subject.dispatchEvent("my-custom-event")).not.toThrow();
		});
	});
});
