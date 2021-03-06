import { ConfirmationWindow } from "src/ui/components";
import Confirm, { Result } from "src/ux/modals/confirm";

describe("WebFun.UX.Modal.Confirm", () => {
	beforeAll(() => {
		customElements.define(ConfirmationWindow.tagName, ConfirmationWindow);
	});

	afterEach(() => {
		const component: ConfirmationWindow = document.querySelector(ConfirmationWindow.tagName);
		if (component && component.onabort) component.onabort();
	});

	it("is a function that prompts the user for confirmation", () => {
		expect(Confirm).toBeFunction();
	});

	it("uses a component to render the UI", done => {
		expect(document.querySelector(ConfirmationWindow.tagName)).toBeNull();

		const promise = Confirm("Please confirm something!", {
			confirmText: "Ok",
			abortText: "Nope!"
		});

		const component: ConfirmationWindow = document.querySelector(ConfirmationWindow.tagName);
		expect(component).not.toBeNull();
		expect(component.textContent).toContain("Please confirm something!");
		expect(component.getAttribute("confirm-text")).toEqual("Ok");
		expect(component.getAttribute("abort-text")).toEqual("Nope!");

		// clean up
		component.onabort();
		promise.then(done);
	});

	it("resolves to Result.Confirmed when onconfirm is executed on the component", done => {
		expect(document.querySelector(ConfirmationWindow.tagName)).toBeNull();

		const promise = Confirm("");
		promise.then(result => {
			expect(result).toBe(Result.Confirmed);
			done();
		});

		const component: ConfirmationWindow = document.querySelector(ConfirmationWindow.tagName);
		component.onconfirm();
	});

	it("resolves to Result.Aborted when onabort is executed on the component", done => {
		expect(document.querySelector(ConfirmationWindow.tagName)).toBeNull();

		const promise = Confirm("");
		promise.then(result => {
			expect(result).toBe(Result.Aborted);
			done();
		});

		const component: ConfirmationWindow = document.querySelector(ConfirmationWindow.tagName);
		component.onabort();
	});
});
