import storeFn from '/extension/storage/store';
import loadFn from '/extension/storage/load';

describe('Storage', () => {
	let originalSetItem, originalGetItem, originalConsoleWarn;
	let store, warnings;

	beforeEach(() => {
		originalSetItem = localStorage.setItem;
		originalGetItem = localStorage.getItem;
		originalConsoleWarn = console.warn;

		store = {};
		warnings = [];

		localStorage.setItem = function(key, data) {
			store[key] = data;
		};
		localStorage.getItem = function(key) {
			return store[key];
		};
		console.warn = () => {
			warnings.push(arguments);
		};
	});

	afterEach(() => {
		localStorage.setItem = originalSetItem;
		localStorage.getItem = originalGetItem;
		console.warn = originalConsoleWarn;
	});

	describe('store', () => {
		it('extends the Storage prototype', () => {
			expect(typeof storeFn).toBe('function');

			if (typeof Storage !== 'undefined') {
				expect(typeof localStorage.store).toBe('function');
			}
		});

		it('stores objects in stores', () => {
			let object = {
				a: 5
			};

			localStorage.store('sample', object);
			expect(store['sample']).toBe('{"a":5}');
		});

		it('will log a warning if the object can\' be stringified', () => {
			let circularObject = {};
			circularObject.root = circularObject;

			localStorage.store('sample', circularObject);
			expect(warnings.length).toBe(1);
		});
	});

	describe('load', () => {
		it('extends the Storage prototype', () => {
			expect(typeof loadFn).toBe('function');

			if (typeof Storage !== 'undefined') {
				expect(typeof localStorage.load).toBe('function');
			}
		});

		it('retrieves objects from the storage', () => {
			store['sample'] = '{ "a": 2 }';

			let result = localStorage.load('sample');
			expect(typeof result).toBe('object');
			expect(result.a).toBe(2);
		});

		it('logs a warning if the object can\'t be transformed from json', () => {
			store['sample'] = '{ "a": 2 ';
			localStorage.load('sample');
			expect(warnings.length).toBe(1);
		});

		it('returns undefined if the object does not exist', () => {
			let result = localStorage.load('does not exists');
			expect(result).toBe(undefined);
		});
	});
});
