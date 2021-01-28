import { ConfirmationWindow, Textbox } from "src/ui/components";
import Prompt from "src/ux/modals/prompt";

describe("WebFun.UX.Modal.Prompt", () => {
	let windowMock: ConfirmationWindow;
	let textbox: HTMLInputElement;

	beforeEach(() => {
		windowMock = document.createElement("div") as any;
		textbox = document.createElement("input");
		Object.assign(windowMock, {
			center: () => void 0,
			onabort: () => void 0,
			onconfirm: () => void 0
		});
		spyOn(document, "createElement")
			.withArgs(ConfirmationWindow.tagName)
			.and.returnValue(windowMock)
			.withArgs(Textbox.tagName)
			.and.returnValue(textbox as any)
			.and.callThrough();
	});

	afterEach(() => {
		windowMock.remove();
		if (windowMock && windowMock.onabort) windowMock.onabort();
	});

	it("is a function that prompts the user for input", () => {
		expect(Prompt).toBeFunction();
	});

	it("uses a component to render the UI", async () => {
		const promise = Prompt("Please write your name below!", {
			confirmText: "Done",
			abortText: "Nope!"
		});

		const content = windowMock.customContent as HTMLElement;
		expect(windowMock).not.toBeNull();
		expect(content.innerText).toContain("Please write your name below!");
		expect(windowMock.confirmText).toEqual("Done");
		expect(windowMock.abortText).toEqual("Nope!");

		// clean up
		windowMock.onabort();
		await promise;
	});

	it("resolves to the given string when onconfirm is executed on the component", async () => {
		const prompt = Prompt("What's your name?");
		textbox.value = "Tim";
		windowMock.onconfirm();
		const result = await prompt;
		expect(result).toBe("Tim");
	});

	it("resolves to null when onabort is executed on the component", async () => {
		const prompt = Prompt("");
		windowMock.onabort();
		const result = await prompt;
		expect(result).toBe(null);
	});

	it("can pre-fill the prompt if a defaultValue is given", async () => {
		Prompt("Hi", { defaultValue: "Suggested Value" });
		expect(textbox.value).toEqual("Suggested Value");
	});

	it("keeps the input box empty if no default value is given", async () => {
		Prompt("Hi");
		expect(textbox.value).toEqual("");
	});
});
