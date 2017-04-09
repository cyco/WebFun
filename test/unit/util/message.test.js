import Message from '/util/message';

describe('Message', () => {
	let consoleLogCalled;
	let originalConsole;
	let messages;

	beforeEach(() => {
		window.logging = true;

		messages = [];
		consoleLogCalled = false;
		originalConsole = window.console;
		window.console = {
			warn: (...args) => {
				messages.push(args);
				consoleLogCalled = true;
			}
		};
	});

	afterEach(() => {
		window.logging = false;
		window.console = originalConsole;
	});

	it('is a wrapper for console.warn that only prints something if window.logging is true', () => {
		window.logging = false;
		Message('test');
		expect(consoleLogCalled).toBeFalse();

		window.logging = true;
		Message('test');
		expect(consoleLogCalled).toBeTrue();
		expect(messages[0][0]).toBe('test');

		window.logging = false;
		consoleLogCalled = false;
		Message('test');
		expect(consoleLogCalled).toBeFalse();

		expect(messages.length).toBe(1);
	});

	it('converts booleans to \'1\' and \'0\'', () => {
		Message("%d", false);
		Message("%d", true);

		expect(messages[0][1]).toBe(0);
		expect(messages[1][1]).toBe(1);
	});

	it('prints -1 as 16-bit decimal', () => {
		Message("%d", -1);
		expect(messages[0][1]).toBe('65535');

		Message("%d", 'ffffffff');
		expect(messages[1][1]).toBe('65535');
	});

	it('knows how to print hexadecimals', () => {
		Message("%x", 11);
		expect(messages[0][1]).toBe('b');
	});

	it('converts numbers to strings', () => {
		Message("%d", 11);
		expect(messages[0][1]).toBe('11');
	});

	it('just prints objects', () => {
		Message("%a", {
			toString: () => {
				return '5';
			}
		});
		expect(messages[0][1]).toBe('5');
	});

	it('does not fail if there aren\'t enough arguments', () => {
		Message("%d", 1, 2, 3);
		expect(messages[0][1]).toBe('1');
	});
});
