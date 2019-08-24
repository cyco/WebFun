import WindowMenuItem from "src/ui/window-menu-item";
import { WindowManager, Menu, MenuItemState } from "src/ui";

describe("WebFun.UI.WindowMenuItem", () => {
	let windowManagerMock: WindowManager | any;
	let subject: WindowMenuItem;
	beforeEach(() => {
		windowManagerMock = ({ focus: () => {} } as unknown) as WindowManager;
		subject = new WindowMenuItem(windowManagerMock);
	});

	it("is a menu item that lists all windows of a window manager", () => {
		expect(subject.title).toBe("Window");
		expect(subject.hasSubmenu).toBeTrue();
	});

	describe("when the window manager has no windows", () => {
		beforeEach(() => {
			windowManagerMock.windows = [];
		});

		describe("and the submenu is accessed", () => {
			let submenu: Menu;
			beforeEach(() => (submenu = subject.submenu));

			it("contains one item", () => {
				expect(submenu.items).toBeArrayOfSize(1);
			});

			it("shows that the manager does not have any windows", () => {
				expect(submenu.items.first().title).toBe("No Windows");
			});
		});
	});

	describe("when the window manager has some windows", () => {
		let mockedWindows: Window[];
		beforeEach(() => {
			mockedWindows = [mockWindow("First Window"), mockWindow("Second Window")];
			windowManagerMock.windows = mockedWindows;
			windowManagerMock.topMostWindow = mockedWindows[1];
		});

		describe("and the submenu is accessed", () => {
			let submenu: Menu;
			beforeEach(() => (submenu = subject.submenu));

			it("contains one item for each window", () => {
				expect(submenu.items).toBeArrayOfSize(2);
				expect(submenu.items[0].title).toEqual("First Window");
				expect(submenu.items[1].title).toEqual("Second Window");
			});

			it("marks the item for the front-most window", () => {
				expect(submenu.items[0].state).toBe(MenuItemState.Off);
				expect(submenu.items[1].state).toBe(MenuItemState.On);
			});

			describe("and an item is clicked", () => {
				beforeEach(() => {
					spyOn(windowManagerMock, "focus");
					submenu.items[0].callback();
				});

				it("tells the windowManager to focus the window", () => {
					expect(windowManagerMock.focus).toHaveBeenCalledWith(mockedWindows.first());
				});
			});
		});
	});

	function mockWindow(title: string): Window {
		return ({ title } as unknown) as Window;
	}
});
