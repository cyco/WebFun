import open from "src/extension/html-select-element/open";

describe("WebFun.Extension.HTMLSelectElement.open", () => {
	let subject;
	beforeEach(() => (subject = document.createElement("select")));
	it("is a function to open a select element's menu", () => {
		expect(subject.open).toBeInstanceOf(Function);
		expect(subject.open).toBe(open);
	});

	it("works by faking click events in most browsers", async done => {
		const mockEvent = { initMouseEvent() {} };
		spyOn(mockEvent, "initMouseEvent");
		spyOn(document, "createEvent").and.returnValue(mockEvent);
		spyOn(subject, "dispatchEvent");

		await subject.open();

		expect(document.createEvent).toHaveBeenCalledWith("MouseEvents");
		expect(mockEvent.initMouseEvent).toHaveBeenCalled();
		expect(subject.dispatchEvent).toHaveBeenCalledWith(mockEvent);

		done();
	});

	it("falls back to using fireEvent if createEvent is not available", async done => {
		const originalCreateEvent = document.createEvent;
		document.createEvent = null;

		subject.fireEvent = () => void 0;
		spyOn(subject, "fireEvent");

		await subject.open();

		expect(subject.fireEvent).toHaveBeenCalledWith("onmousedown");

		document.createEvent = originalCreateEvent;
		done();
	});

	it("rejects the promise if neither method is available", async done => {
		const originalCreateEvent = document.createEvent;
		const originalFireEvent = subject.fireEvent;
		subject.fireEvent = null;
		document.createEvent = null;

		try {
			await subject.open();
			expect(false).toBeTrue();
		} catch (_) {
			expect(true).toBeTrue();
		}

		subject.fireEvent = originalFireEvent;
		document.createEvent = originalCreateEvent;
		done();
	});
});
