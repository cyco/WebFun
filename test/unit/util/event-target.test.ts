import { dispatch } from "src/util";
import EventTarget from "src/util/event-target";

describe("WebFun.Util.EventTarget", () => {
	let subject: EventTarget;
	beforeAll(() => {
		subject = new EventTarget();
	});

	it("implements basic event handling functionality without relying on the dom", () => {
		expect(subject.addEventListener).toBeFunction();
		expect(subject.removeEventListener).toBeFunction();
		expect(subject.dispatchEvent).toBeFunction();
	});

	it("has methods to listen for events without observing a specific object", () => {
		expect(EventTarget.addEventListener).toBeFunction();
		expect(EventTarget.removeEventListener).toBeFunction();
		expect(EventTarget.dispatchEvent).toBeFunction();
	});

	it("calls all registered event handlers when an event is dispatched", done => {
		let directCallbackExecuted = false;
		let globalCallbackExecuted = false;
		let callbackPropertyExecuted = false;
		let eventListenerObjectExecuted = false;
		const continueWhenAllCallbacksAreExecuted = () => {
			if (
				directCallbackExecuted &&
				globalCallbackExecuted &&
				callbackPropertyExecuted &&
				eventListenerObjectExecuted
			)
				done();
		};

		(subject as any).ontestEvent = () => {
			callbackPropertyExecuted = true;
			continueWhenAllCallbacksAreExecuted();
		};
		subject.addEventListener("testEvent", () => {
			directCallbackExecuted = true;
			continueWhenAllCallbacksAreExecuted();
		});
		subject.addEventListener("testEvent", {
			handleEvent() {
				eventListenerObjectExecuted = true;
				continueWhenAllCallbacksAreExecuted();
			}
		});
		EventTarget.addEventListener("testEvent", () => {
			globalCallbackExecuted = true;
			continueWhenAllCallbacksAreExecuted();
		});

		subject.dispatchEvent("testEvent");
	});

	it("event handlers can be unregistered per event type", done => {
		const executedCallbacks: boolean[] = [];

		subject.addEventListener("testEvent", () => {
			executedCallbacks[0] = true;
		});
		subject.addEventListener("testEvent", () => {
			executedCallbacks[1] = true;
		});

		subject.removeEventListener("testEvent");
		subject.dispatchEvent("testEvent");

		dispatch(() => {
			expect(executedCallbacks[0]).toBeFalsy();
			expect(executedCallbacks[1]).toBeFalsy();

			done();
		});
	});

	it("event handlers can be unregistered per type & callback ", done => {
		const executedCallbacks: boolean[] = [];
		const fn1 = () => {
			executedCallbacks[0] = true;
		};
		subject.addEventListener("testEvent", fn1);
		subject.addEventListener("testEvent", () => {
			executedCallbacks[1] = true;
		});

		subject.removeEventListener("testEvent", fn1);
		subject.dispatchEvent(new CustomEvent("testEvent"));

		dispatch(() => {
			expect(executedCallbacks[0]).toBeFalsy();
			expect(executedCallbacks[1]).toBeTrue();

			done();
		});
	});

	it("global event handlers can be unregistered in the same way ", done => {
		const executedCallbacks: boolean[] = [];
		const fn1 = () => {
			executedCallbacks[0] = true;
		};
		EventTarget.addEventListener("testEvent", fn1);
		EventTarget.addEventListener("testEvent", () => {
			executedCallbacks[1] = true;
		});

		EventTarget.removeEventListener("testEvent", fn1);
		subject.dispatchEvent(new CustomEvent("testEvent"));

		dispatch(() => {
			expect(executedCallbacks[0]).toBeFalsy();
			expect(executedCallbacks[1]).toBeTrue();

			done();
		});
	});

	it("removeEventListener won't do anything if the callback is not registered", () => {
		expect(() => subject.removeEventListener("testEvent-2", () => {})).not.toThrow();

		subject.addEventListener("testEvent", () => {});
		expect(() => {
			subject.removeEventListener("testEvent", () => {
				return 15;
			});
		}).not.toThrow();
	});

	it("dispatch events also works on the class itself", done => {
		EventTarget.addEventListener("testEvent", done);
		EventTarget.dispatchEvent(new CustomEvent("testEvent"));
	});

	it("has a method to register all events to make it compatible with sealed objects", () => {
		const protectedSubject = subject as any;
		expect(protectedSubject.registerEvents).not.toBe(undefined);

		protectedSubject.registerEvents({ E1: "testEvent1", E2: "testEvent2" });

		expect(protectedSubject.ontestEvent1).toBe(null);
		expect(protectedSubject.ontestEvent2).toBe(null);
	});

	it("sets the `target` property of the dispatched event", done => {
		const subject = new EventTarget();
		const event = new CustomEvent("Test");
		subject.addEventListener("Test", (e: CustomEvent) => {
			expect(e.target).toBe(subject);
			done();
		});
		subject.dispatchEvent(event);
	});
});
