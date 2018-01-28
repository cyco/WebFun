import Textbox from "src/ui/components/textbox";

describeComponent(Textbox, () => {
	let subject;
	beforeEach(() => (subject = render(Textbox)));

	it("can be editable", () => {
		expect(subject.editable).toBeTrue();

		subject.editable = false;
		expect(subject.editable).toBeFalse();
		expect(subject._element.hasAttribute("readonly")).toBeTrue();

		subject.editable = true;
		expect(subject.editable).toBeTrue();
		expect(subject._element.hasAttribute("readonly")).toBeFalse();
	});

	it("can have a fixed size", () => {
		subject.width = 250;
		subject.height = 30;

		expect(subject.width).toBe(250);
		expect(subject.height).toBe(30);
	});

	it("might have a value", () => {
		subject.value = "test string value";
		expect(subject.value).toEqual("test string value");
	});

	it("always returns a string value", () => {
		subject.value = 5;
		expect(subject.value).toBe("5");
	});

	it("has an alignment attribute", () => {
		expect(subject.align).toEqual("left");

		subject.align = "right";
		expect(subject.align).toEqual("right");
		expect(subject._element.style.textAlign).toEqual("right");
	});

	it("can have an onchange event", () => {
		let handlerCalled = false;
		const handler = () => (handlerCalled = true);

		subject.onchange = handler;
		expect(subject.onchange).toBe(handler);

		subject._element.onchange();
		expect(handlerCalled).toBeTrue();
	});
});
