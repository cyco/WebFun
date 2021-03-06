import WindowTitlebar from "src/ui/components/window-titlebar";
import { Window } from "src/ui/components";

describeComponent(WindowTitlebar, () => {
	let subject: WindowTitlebar;
	beforeEach(() => (subject = render(WindowTitlebar) as WindowTitlebar));
	afterEach(() => subject.remove());

	it("is used to draw the title of a window", () => {
		expect(WindowTitlebar).toBeCustomElement();
	});

	describe("title", () => {
		it("shows the title", () => {
			subject.title = "My Test Text";
			expect(subject.title).toBe("My Test Text");
			expect(subject.textContent).toContain("My Test Text");
		});

		it("updates the text in the dom as soon as the property changes", () => {
			subject.title = "My Test Text";
			subject.title = "New Title";

			expect(subject.textContent).toContain("New Title");
		});

		it("can be removed", () => {
			subject.title = "Test";
			subject.title = null;

			expect(subject.textContent).not.toContain("Test");
		});
	});

	describe("close button", () => {
		it("is only visible when closable is set", () => {
			subject.closable = true;
			expect((subject as any)._closeButton.style.display).not.toBe("none");

			subject.closable = false;
			expect(subject.closable).toBeFalse();
			expect((subject as any)._closeButton.style.display).toBe("none");
		});

		it("calls close on the window when clicked", () => {
			const mockWindow: Window = {
				close() {}
			} as any;
			spyOn(mockWindow, "close");
			subject.window = mockWindow;
			expect(subject.window).toEqual(mockWindow);

			(subject as any)._closeButton.dispatchEvent(new MouseEvent("click"));
			expect(mockWindow.close).toHaveBeenCalled();
		});
	});

	describe("pinnable", () => {
		it("is an attribute that make the title bar show an additional button", () => {
			expect(subject.pinnable).toBeFalse();
			subject.pinnable = true;
			expect(subject.pinnable).toBeTrue();

			expect((subject as any)._pinButton).not.toBeNull();
			subject.pinnable = false;
			expect((subject as any)._pinButton).toBeNull();
		});

		it("works if the attribute is set before inserting the titlebar into the dom", () => {
			subject = document.createElement(WindowTitlebar.tagName);
			subject.pinnable = true;
			document.body.appendChild(subject);
			expect((subject as any)._pinButton.isConnected).toBeTrue();
		});
	});
});
