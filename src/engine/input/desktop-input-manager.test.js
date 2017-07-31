import DesktopInputManager from "/engine/input/desktop-input-manager";
import { Direction } from "/engine/input/input-manager";
import { KeyEvent } from "/util";

describe('DesktopInputManager', () => {
	let manager = null;

	beforeAll(() => {
		manager = new DesktopInputManager();
	});

	afterEach(() => {
		manager.removeListeners();
	});

	it('collects game input from keyboard and mouse', () => {
		let manager = new DesktopInputManager();

		expect(typeof manager.keyDown).toBe('function');
		expect(typeof manager.keyUp).toBe('function');
		expect(typeof manager.mouseDown).toBe('function');
		expect(typeof manager.mouseMove).toBe('function');
		expect(typeof manager.mouseUp).toBe('function');
	});

	describe('keyboard input', () => {
		it('toggles locator when the l-key is pressed', () => {
			manager.keyDown({which: KeyEvent.DOM_VK_L});
			expect(manager.locator).toBeTrue();

			manager.keyDown({which: KeyEvent.DOM_VK_L});
			expect(manager.locator).toBeFalse();

			manager.keyDown({which: KeyEvent.DOM_VK_L});
			expect(manager.locator).toBeTrue();
		});

		it('toggles pause when the p-key is pressed', () => {
			manager.keyDown({which: KeyEvent.DOM_VK_P});
			expect(manager.pause).toBeTrue();

			manager.keyDown({which: KeyEvent.DOM_VK_P});
			expect(manager.pause).toBeFalse();

			manager.keyDown({which: KeyEvent.DOM_VK_P});
			expect(manager.pause).toBeTrue();
		});


		it('activates dragging while shift key is pressed', () => {
			manager.keyDown({which: KeyEvent.DOM_VK_SHIFT});
			expect(manager._drag).toBeTrue();
			manager.keyDown({which: KeyEvent.DOM_VK_SHIFT});
			expect(manager._drag).toBeTrue();

			manager.keyUp({which: KeyEvent.DOM_VK_SHIFT});
			expect(manager._drag).toBeFalse();
		});


		it('keeps track of directional input', () => {
			let Mask = Direction;

			let upKey = {which: KeyEvent.DOM_VK_UP};
			let downKey = {which: KeyEvent.DOM_VK_DOWN};
			let leftKey = {which: KeyEvent.DOM_VK_LEFT};
			let rightKey = {which: KeyEvent.DOM_VK_RIGHT};

			manager.keyDown(upKey);
			expect(manager._direction & Mask.Up).toBeTruthy();
			manager.keyDown(downKey);
			expect(manager._direction & Mask.Down).toBeTruthy();
			manager.keyDown(leftKey);
			expect(manager._direction & Mask.Left).toBeTruthy();
			manager.keyDown(rightKey);
			expect(manager._direction & Mask.Right).toBeTruthy();

			manager.keyUp(upKey);
			expect(manager._direction & Mask.Up).toBeFalsy();
			manager.keyUp(downKey);
			expect(manager._direction & Mask.Down).toBeFalsy();
			manager.keyUp(leftKey);
			expect(manager._direction & Mask.Left).toBeFalsy();
			manager.keyUp(rightKey);
			expect(manager._direction & Mask.Right).toBeFalsy();
		});

		it('tracks the \'attack\' key', () => {
			let attackKey = {which: KeyEvent.DOM_VK_SPACE};
			manager.keyDown(attackKey);
			expect(manager._attack).toBeTrue();
			manager.keyUp(attackKey);
			expect(manager._attack).toBeFalse();
		});

		it('tracks the \'end dialog\' key', () => {
			let endDialogKey = {which: KeyEvent.DOM_VK_SPACE};
			manager.keyDown(endDialogKey);
			expect(manager.endDialog).toBeTrue();
		});

		it('tracks the \'pick up\' key', () => {
			let pickUpKey = {which: KeyEvent.DOM_VK_SPACE};
			manager.keyDown(pickUpKey);
			expect(manager.pickUp).toBeTrue();
		});

		it('ignores unknown keys', () => {
			let unknownKey = {which: 12};

			expect(() => {
				manager.keyDown(unknownKey);
				manager.keyUp(unknownKey);
			}).not.toThrow();
		});
	});
});
