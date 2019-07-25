import open from "src/extension/html-select-element/open";

describe("WebFun.Extension.HTMLSelectElement.open", () => {
	let subject: HTMLSelectElement;
	beforeEach(() => (subject = document.createElement("select")));
	it("is a function to open a select element's menu", () => {
		expect(subject.open).toBeInstanceOf(Function);
		expect(subject.open).toBe(open);
	});

	it("works by faking click events in most browsers", async () => {
		const mockEvent: MouseEvent = { initMouseEvent() {} } as any;
		spyOn(mockEvent, "initMouseEvent");
		spyOn(document, "createEvent").and.returnValue(mockEvent);
		spyOn(subject, "dispatchEvent");

		await subject.open();

		expect(document.createEvent).toHaveBeenCalledWith("MouseEvents");
		expect(mockEvent.initMouseEvent).toHaveBeenCalled();
		expect(subject.dispatchEvent).toHaveBeenCalledWith(mockEvent);
	});

	it("falls back to using fireEvent if createEvent is not available", async () => {
		const originalCreateEvent = document.createEvent;
		document.createEvent = null;

		(subject as any).fireEvent = (): void => void 0;
		spyOn(subject as any, "fireEvent");

		await subject.open();

		expect((subject as any).fireEvent).toHaveBeenCalledWith("onmousedown");

		document.createEvent = originalCreateEvent;
	});

	it("rejects the promise if neither method is available", async () => {
		const originalCreateEvent = document.createEvent;
		const originalFireEvent = (subject as any).fireEvent;
		(subject as any).fireEvent = null;
		document.createEvent = null;

		try {
			await subject.open();
			expect(false).toBeTrue();
		} catch (_) {
			expect(true).toBeTrue();
		}

		(subject as any).fireEvent = originalFireEvent;
		document.createEvent = originalCreateEvent;
	});
});
