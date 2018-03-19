import WindowTitlebar from "src/ui/components/window-titlebar";

describeComponent(WindowTitlebar, () => {
	let subject;
	beforeEach(() => (subject = render(WindowTitlebar)));
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
			expect(subject._closeButton.style.display).not.toBe("none");

			subject.closable = false;
			expect(subject.closable).toBeFalse();
			expect(subject._closeButton.style.display).toBe("none");
		});

		it("calls close on the window when clicked", () => {
			const mockWindow = { close() {} };
			spyOn(mockWindow, "close");
			subject.window = mockWindow;
			expect(subject.window).toEqual(mockWindow);

			subject._closeButton.dispatchEvent(new MouseEvent("click"));
			expect(mockWindow.close).toHaveBeenCalled();
		});
	});

	describe("pinnable", () => {
		it("is an attribute that make the title bar show an additional button", () => {
			expect(subject.pinnable).toBeFalse();
			subject.pinnable = true;
			expect(subject.pinnable).toBeTrue();

			expect(subject._pinButton).not.toBeNull();
			subject.pinnable = false;
			expect(subject._pinButton).toBeNull();
		});

		it("works if the attribute is set before inserting the titlebar into the dom", () => {
			subject = document.createElement(WindowTitlebar.TagName);
			subject.pinnable = true;
			const container = document.createElement("div");
			document.body.appendChild(subject);
			expect(subject._pinButton.isConnected).toBeTrue();
		});
	});
});
