import WindowManager from "src/ui/window-manager";
import { Window } from "src/ui/components";

describe("WebFun.UI.WindowManager", () => {
	let subject: WindowManager;
	let container: HTMLDivElement;

	beforeEach(() => {
		container = document.createElement("div");
		subject = new WindowManager(container);
	});

	it("is a class that manages order and focus of windows within a container", () => {
		expect(WindowManager).toBeAClass();
	});

	it("acts as a multiton with the default instance managing windows in `document.body`", () => {
		expect(WindowManager.defaultManager).toBe(WindowManager.defaultManager);
		expect((WindowManager.defaultManager as any)._container).toBe(document.body);
	});

	describe("when a window is show", () => {
		let firstWindow: Window, secondWindow: Window;
		beforeEach(() => {
			firstWindow = mockWindow();
			secondWindow = mockWindow();
			subject.showWindow(firstWindow);
			subject.showWindow(secondWindow);
		});

		it("is added to the list of windows", () => {
			expect(subject.windows).toEqual([firstWindow, secondWindow]);
		});

		it("is automatically made the front-most window", () => {
			expect(subject.topMostWindow).toEqual(secondWindow);
		});

		it("is positioned above other windows", () => {
			expect(+secondWindow.style.zIndex).toBeGreaterThan(+firstWindow.style.zIndex);
		});

		it("is added to the container", () => {
			expect(container.children).toContain(firstWindow);
			expect(container.children).toContain(secondWindow);
		});

		it("is informed of it's manager", () => {
			expect(firstWindow.manager).toBe(subject);
		});

		describe("when a different window is focused", () => {
			beforeEach(() => {
				subject.focus(firstWindow);
			});

			it("is made the top-most window", () => {
				expect(subject.topMostWindow).toBe(firstWindow);
			});

			it("is positioned in front of other windows", () => {
				expect(+firstWindow.style.zIndex).toBeGreaterThan(+secondWindow.style.zIndex);
			});
		});

		describe("and the window is shown again", () => {
			beforeEach(() => {
				subject.showWindow(firstWindow);
			});

			it("just focuses the window", () => {
				expect(subject.topMostWindow).toBe(firstWindow);
			});
		});

		describe("and the front-most window is closed", () => {
			beforeEach(() => {
				secondWindow.dispatchEvent(new CustomEvent(Window.Event.DidClose));
			});

			it("focuses the remaining window", () => {
				expect(subject.topMostWindow).toBe(firstWindow);
			});
		});

		describe("when there are a lot of windows", () => {
			let thirdWindow: Window;
			beforeEach(() => {
				thirdWindow = mockWindow();
				subject.showWindow(mockWindow());
				subject.showWindow(thirdWindow);
				subject.showWindow(mockWindow());

				subject.focus(firstWindow);
				subject.focus(secondWindow);
				subject.focus(firstWindow);
				subject.focus(thirdWindow);
				subject.focus(secondWindow);
			});

			describe("and the top-most window is closed", () => {
				beforeEach(() => {
					subject.topMostWindow.dispatchEvent(new CustomEvent(Window.Event.DidClose));
				});

				it("focuses the next best window", () => {
					expect(subject.topMostWindow).toBe(thirdWindow);
				});
			});
		});

		describe("when a window is closed that is not the top-most window", () => {
			let originalZIndex: string;
			beforeEach(() => {
				originalZIndex = subject.topMostWindow.style.zIndex;
				firstWindow.dispatchEvent(new CustomEvent(Window.Event.DidClose));
			});

			it("'s z-index does not increase", () => {
				expect(subject.topMostWindow.style.zIndex).toEqual(originalZIndex);
			});
		});

		describe("and the last window is closed", () => {
			beforeEach(() => {
				subject.topMostWindow.dispatchEvent(new CustomEvent(Window.Event.DidClose));
				subject.topMostWindow.dispatchEvent(new CustomEvent(Window.Event.DidClose));
			});

			it("does not have a top-most window anymore", () => {
				expect(subject.topMostWindow).toBeNull();
			});
		});

		describe("when the top-most window is focused again", () => {
			let originalZIndex: string;
			beforeEach(() => {
				originalZIndex = subject.topMostWindow.style.zIndex;
				subject.focus(subject.topMostWindow);
			});

			it("'s z-index does not increase", () => {
				expect(subject.topMostWindow.style.zIndex).toEqual(originalZIndex);
			});
		});
	});

	it("has a method to temporarily override the default window manager", () => {
		const originalDefault = WindowManager.defaultManager;
		subject.asDefaultManager(() => {
			expect(WindowManager.defaultManager).not.toBe(originalDefault);
			expect(WindowManager.defaultManager).toBe(subject);
		});
	});

	function mockWindow(): Window {
		const mockedWindow = document.createElement("div");

		return (mockedWindow as unknown) as Window;
	}
});
