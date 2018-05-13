import { ConfirmationWindow } from "src/ui/components";
import Confirm, { Result } from "src/ux/modals/confirm";

describe("Confirm", () => {
	beforeAll(() => {
		customElements.define(
			ConfirmationWindow.tagName,
			ConfirmationWindow,
			ConfirmationWindow.options
		);
	});

	afterEach(() => {
		const component = document.querySelector(ConfirmationWindow.tagName);
		if (component && component.onabort) component.onabort();
	});

	it("is a function that prompts the user for confirmation", () => {
		expect(Confirm).toBeFunction();
	});

	it("uses a component to render the UI", () => {
		Confirm("Please confirm something!", {
			confirmText: "Ok",
			abortText: "Nope!"
		});

		const component = document.querySelector(ConfirmationWindow.tagName);
		expect(component).not.toBeNull();
		expect(component.textContent).toContain("Please confirm something!");
		expect(component.getAttribute("confirm-text")).toEqual("Ok");
		expect(component.getAttribute("abort-text")).toEqual("Nope!");

		// clean up
		component.onabort();
	});

	it("resolves to Result.Confirmed when onconfirm is executed on the component", done => {
		const promise = Confirm("");
		promise.then(result => {
			expect(result).toBe(Result.Confirmed);
			done();
		});

		const component = document.querySelector(ConfirmationWindow.tagName);
		component.onconfirm();
	});

	it("resolves to Result.Aborted when onabort is executed on the component", done => {
		const promise = Confirm("");
		promise.then(result => {
			expect(result).toBe(Result.Aborted);
			done();
		});

		const component = document.querySelector(ConfirmationWindow.tagName);
		component.onabort();
	});
});
