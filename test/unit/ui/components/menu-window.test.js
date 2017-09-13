import MenuWindow from "src/ui/components/menu-window";
import { Menu, MenuStack } from "src/ui";
import { Point } from "src/util";

describeComponent(MenuWindow, () => {
	let subject;
	beforeEach(() => subject = render(MenuWindow));
	afterEach(() => MenuStack.sharedStack.clear());

	it("is a menu view that can be shown at a desired location", () => {
		expect(subject.show).toBeFunction();
	});

	it("can be shown at a point", () => {
		const point = new Point(10, 15);

		subject.menu = new Menu([{title: "My Item"}]);
		subject.show(point);

		expect(subject.style.left).toEqual("10px");
		expect(subject.style.top).toEqual("15px");
	});

	it("can be shown below an element", () => {
		const referenceElement = document.createElement("div");
		referenceElement.style.width = "120px";
		referenceElement.style.top = "10px";
		referenceElement.style.left = "15px";
		referenceElement.style.height = "15px";
		referenceElement.style.position = "absolute";
		document.body.appendChild(referenceElement);

		subject.menu = new Menu([{title: "My Item"}]);
		subject.show(referenceElement);
	});

	it("throws an error if neither Point nor Element is given", () => {
		expect(() => subject.show(5)).toThrow();
	});

	it("adds the window to the shared menu stack", () => {
		subject.menu = new Menu([{title: "My Item"}]);
		subject.show(new Point(0, 0));

		expect(MenuStack.sharedStack.size).toBe(1);
	});

	it("can add the window to a different stack if necessary", () => {
		const customStack = new MenuStack();
		subject.menu = new Menu([{title: "My Item"}]);
		subject.show(new Point(0, 0), customStack);

		expect(MenuStack.sharedStack.size).toBe(0);
		expect(customStack.size).toBe(1);
	});
});
