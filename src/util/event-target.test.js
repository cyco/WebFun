import { dispatch } from "/util";
import EventTarget from "/util/event-target";

describe('EventTarget', () => {
	let target;
	beforeAll(() => {
		target = new EventTarget();
	});

	it('implements basic event handling functionality without relying on the dom', () => {
		expect(typeof target.addEventListener).toBe('function');
		expect(typeof target.removeEventListener).toBe('function');
		expect(typeof target.dispatchEvent).toBe('function');
	});

	it('has methods to listen for events without observing a specific object', () => {
		expect(typeof EventTarget.addEventListener).toBe('function');
		expect(typeof EventTarget.removeEventListener).toBe('function');
		expect(typeof EventTarget.dispatchEvent).toBe('function');
	});

	it('calls all registered event handlers when an event is dispatched', (done) => {
		let directCallbackExecuted = false;
		let globalCallbackExecuted = false;
		let callbackPropertyExecuted = false;
		let continueWhenAllCallbacksAreExecuted = () => {
			if (directCallbackExecuted && globalCallbackExecuted && callbackPropertyExecuted)
				done();
		};

		target.ontestEvent = () => {
			callbackPropertyExecuted = true;
			continueWhenAllCallbacksAreExecuted();
		};
		target.addEventListener('testEvent', () => {
			directCallbackExecuted = true;
			continueWhenAllCallbacksAreExecuted();
		});
		EventTarget.addEventListener('testEvent', () => {
			globalCallbackExecuted = true;
			continueWhenAllCallbacksAreExecuted();
		});

		target.dispatchEvent('testEvent');
	});

	it('event handlers can be unregistered per event type', (done) => {
		let executedCallbacks = [];

		target.addEventListener('testEvent', () => {
			executedCallbacks[0] = true;
		});
		target.addEventListener('testEvent', () => {
			executedCallbacks[1] = true;
		});

		target.removeEventListener('testEvent');
		target.dispatchEvent('testEvent');

		dispatch(() => {
			expect(executedCallbacks[0]).toBeFalsy();
			expect(executedCallbacks[1]).toBeFalsy();

			done();
		}, 10);
	});

	it('event handlers can be unregistered per type & callback ', (done) => {
		let executedCallbacks = [];
		let fn1 = () => {
			executedCallbacks[0] = true;
		};
		target.addEventListener('testEvent', fn1);
		target.addEventListener('testEvent', () => {
			executedCallbacks[1] = true;
		});

		target.removeEventListener('testEvent', fn1);
		target.dispatchEvent('testEvent');

		dispatch(() => {
			expect(executedCallbacks[0]).toBeFalsy();
			expect(executedCallbacks[1]).toBeTrue();

			done();
		}, 10);
	});

	it('global event handlers can be unregistered in the same way ', (done) => {
		let executedCallbacks = [];
		let fn1 = () => {
			executedCallbacks[0] = true;
		};
		EventTarget.addEventListener('testEvent', fn1);
		EventTarget.addEventListener('testEvent', () => {
			executedCallbacks[1] = true;
		});

		EventTarget.removeEventListener('testEvent', fn1);
		target.dispatchEvent('testEvent');

		dispatch(() => {
			expect(executedCallbacks[0]).toBeFalsy();
			expect(executedCallbacks[1]).toBeTrue();

			done();
		}, 10);
	});

	it('won\'t do anything if removeEventListener is called without arguments', (done) => {
		EventTarget.addEventListener('testEvent', done);
		expect(() => {
			EventTarget.removeEventListener();
		}).not.toThrow();
		target.dispatchEvent('testEvent');
	});

	it('removeEventListener won\'t do anything if the callback is not registered', () => {
		expect(() => {
			target.removeEventListener('testEvent', () => {
			});
		}).not.toThrow();

		target.addEventListener('testEvent', () => {
		});
		expect(() => {
			target.removeEventListener('testEvent', () => {
				return 15;
			});
		}).not.toThrow();
	});

	it('event handling can be stopped by returning false from the callback property', (done) => {
		let eventListenerExecuted = false;
		target.ontestEvent = () => {
			return false;
		};
		target.addEventListener('testEvent', () => {
			eventListenerExecuted = true;
		});

		target.dispatchEvent('testEvent');

		dispatch(() => {
			expect(eventListenerExecuted).toBeFalsy();
			done();
		}, 10);
	});

	it('dispatch events also works on the class itself', (done) => {
		EventTarget.addEventListener('testEvent', done);
		EventTarget.dispatchEvent('testEvent');
	});

	it('has a method to register all events to make it compatible with sealed objects', () => {
		expect(target.registerEvents).not.toBe(undefined);

		target.registerEvents({E1: 'testEvent1', E2: 'testEvent2'});

		expect(target.ontestEvent1).toBe(null);
		expect(target.ontestEvent2).toBe(null);
	});
});
