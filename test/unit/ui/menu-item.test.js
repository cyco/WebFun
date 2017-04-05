import sandboxed from '../../helpers/dom-sandbox';
import {default as MenuItem, State, Separator} from '/ui/menu-item';
describe('MenuItem', sandboxed((sand) => {
	it('represents an item in a menu', () => {
		let menuItem = new MenuItem();
	});

	it('can be initiated with an object specifying releveant properties', () => {
		let callbackExecuted = false;
		let properties = {
			title: 'test-title',
			state: State.Mixed,
			callback: () => {
				callbackExecuted = true;
			},
			enabled: false,
			mnemonic: "M"
		};
		let menuItem = new MenuItem(properties);

		expect(menuItem.title).toBe('test-title');
		expect(menuItem.state).toBe(State.Mixed);
		expect(menuItem.enabled).toBe(false);
		expect(menuItem.mnemonic).toBe('M');
	});

	it('defines a special item used to represent separatation between other items', () => {
		expect(Separator).not.toBe(undefined);
	});

	it('is enabled by default, if it has a callback or a submenu', () => {
		let menuItem = new MenuItem({});
		expect(menuItem.enabled).toBe(false);

		menuItem = new MenuItem({ callback: () => null });
		expect(menuItem.enabled).toBe(true);

		menuItem = new MenuItem({ submenu: [] });
		expect(menuItem.enabled).toBe(true);

		menuItem = new MenuItem();
		expect(menuItem.enabled).toBe(false);
	});

	it('can be dynamically disabled by supplying a function', () => {
		let menuItem = new MenuItem({ callback: () => null });

		expect(menuItem.enabled).toBe(true);

		let functionCalls = 0;
		menuItem.enabled = () => {
			functionCalls++;
			return functionCalls > 1;
		};
		expect(menuItem.enabled).toBe(false);
		expect(functionCalls).toBe(1);
		expect(menuItem.enabled).toBe(true);
		expect(functionCalls).toBe(2);
	});
}));
