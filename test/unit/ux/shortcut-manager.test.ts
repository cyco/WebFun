import ShortcutManager, { Shortcut } from "src/ux/shortcut-manager";

describe("WebFun.UX.ShortcutManager", () => {
	let subject: ShortcutManager;
	beforeEach(() => {
		subject = new ShortcutManager();
	});

	it("is a class that manages keyboard shortcuts", () => {
		expect(ShortcutManager).toBeAClass();
	});

	it("offers a global shared instance", () => {
		expect(ShortcutManager.sharedManager).toBeInstanceOf(ShortcutManager);
		expect(ShortcutManager.sharedManager).toBe(ShortcutManager.sharedManager);
	});

	describe("when a simple shortcut is registered", () => {
		let meta10ShortcutHandler: jasmine.Spy;
		let meta10Shortcut: Shortcut;
		let ctrl10ShortcutHandler: jasmine.Spy;

		beforeEach(() => {
			meta10ShortcutHandler = jasmine.createSpy();
			ctrl10ShortcutHandler = jasmine.createSpy();

			meta10Shortcut = subject.registerShortcut(meta10ShortcutHandler, { metaKey: true, keyCode: 10 });
			subject.registerShortcut(ctrl10ShortcutHandler, { ctrlKey: true, keyCode: 10 });
		});

		describe("and the keyboard combination is triggered", () => {
			beforeEach(() => subject.handleEvent(mockKeyboardEvent({ keyCode: 10, metaKey: true })));

			it("executes the callback registered for the combination", () => {
				expect(meta10ShortcutHandler).toHaveBeenCalled();
				expect(ctrl10ShortcutHandler).not.toHaveBeenCalled();
			});

			it("ignores events that don't match any shortcut", () => {
				meta10ShortcutHandler.calls.reset();
				subject.handleEvent(mockKeyboardEvent({ keyCode: 10, metaKey: false }));
				expect(meta10ShortcutHandler).not.toHaveBeenCalled();
			});

			describe("and the combination is unregistered", () => {
				beforeEach(() => {
					subject.unregisterShortcut(meta10Shortcut);
					meta10ShortcutHandler.calls.reset();
				});

				describe("and the combination is triggered again", () => {
					beforeEach(() =>
						subject.handleEvent(
							mockKeyboardEvent({
								keyCode: 10,
								metaKey: true
							})
						)
					);

					it("does not execute the callback anymore", () => {
						expect(meta10ShortcutHandler).not.toHaveBeenCalled();
					});
				});
			});
		});
	});

	describe("when a shortcut is registered that does not use a modifier key", () => {
		let code10ShortcutHandler: jasmine.Spy;
		let code10Shortcut: Shortcut;

		beforeEach(() => {
			code10ShortcutHandler = jasmine.createSpy();
			code10Shortcut = subject.registerShortcut(code10ShortcutHandler, { keyCode: 10 });
		});

		describe("and the keyboard combination is triggered", () => {
			beforeEach(() => subject.handleEvent(mockKeyboardEvent({ keyCode: 10, metaKey: true })));

			it("executes the callback registered for the combination", () => {
				expect(code10ShortcutHandler).toHaveBeenCalled();
			});

			describe("and the combination is unregistered", () => {
				beforeEach(() => {
					subject.unregisterShortcut(code10Shortcut);
					code10ShortcutHandler.calls.reset();
				});

				describe("and the combination is triggered again", () => {
					beforeEach(() =>
						subject.handleEvent(
							mockKeyboardEvent({
								keyCode: 10
							})
						)
					);

					it("does not execute the callback anymore", () => {
						expect(code10ShortcutHandler).not.toHaveBeenCalled();
					});
				});
			});
		});
	});

	describe("when a shortcut bound to a focus node is registered", () => {
		let nodeBoundShortcutHandler: jasmine.Spy;
		let node: HTMLElement;

		beforeEach(() => {
			node = document.createElement("div");
			nodeBoundShortcutHandler = jasmine.createSpy();
			subject.registerShortcut(nodeBoundShortcutHandler, {
				keyCode: 10,
				metaKey: true,
				node
			});
		});

		describe("and the keyboard combination is triggered", () => {
			beforeEach(() => subject.handleEvent(mockKeyboardEvent({ keyCode: 10, metaKey: true })));

			it("does not execute the callback registered for the combination because the node has not been focused", () => {
				expect(nodeBoundShortcutHandler).not.toHaveBeenCalled();
			});
		});

		describe("and the node is focused", () => {
			beforeEach(() => subject.handleEvent(mockMouseEvent(node)));

			describe("and the keyboard combination is triggered", () => {
				beforeEach(() => subject.handleEvent(mockKeyboardEvent({ keyCode: 10, metaKey: true })));

				it("executes the callback registered for the combination", () => {
					expect(nodeBoundShortcutHandler).toHaveBeenCalled();
				});
			});

			describe("and the node is moved away from the node", () => {
				beforeEach(() => subject.handleEvent(mockFocusEvent(null)));

				describe("when the keyboard combination is triggered", () => {
					beforeEach(() => subject.handleEvent(mockKeyboardEvent({ keyCode: 10, metaKey: true })));

					it("does not execute the callback anymore", () => {
						expect(nodeBoundShortcutHandler).not.toHaveBeenCalled();
					});
				});
			});
		});
	});

	it("ignores bogus `unregister` calls", () => {
		expect(() => subject.unregisterShortcut(null)).not.toThrow();
	});

	function mockKeyboardEvent(desc: any) {
		return { ...desc, stopImmediatePropagation: (): void => void 0, preventDefault: (): void => void 0 };
	}

	function mockFocusEvent(node: any) {
		return new FocusEvent("focus", { relatedTarget: node });
	}

	function mockMouseEvent(node: any) {
		const event = new MouseEvent("click");
		spyOnProperty(event, "target").and.returnValue(node);
		return event;
	}
});
