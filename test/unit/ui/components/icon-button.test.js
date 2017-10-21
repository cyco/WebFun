import IconButton from "src/ui/components/icon-button.ts";
import render from "test-helpers/render";

describe("icon-button", () => {
	let subject;

	beforeAll(() => customElements.define(IconButton.TagName, IconButton, IconButton.Options));

	it("is a custom element", () => {
		expect(IconButton).toBeCustomElement();
	});

	it("uses the tag name 'wf-icon-button'", () => {
		expect(IconButton.TagName).toBe("wf-icon-button");
	});

	it("takes a font-awesome icon name in the icon attribute", () => {
		subject = render(IconButton, {icon: "test"});
		expect(subject.icon).toBe("test");
		expect(subject.querySelector(".fa-test")).not.toBeNull();

		subject.icon = "my-new-icon";
		expect(subject.querySelector(".fa-my-new-icon")).not.toBeNull();
	});

	it("can be disabled", () => {
		subject = render(IconButton, {}, ["disabled"]);
		expect(subject).toHaveAttribute("disabled");
		expect(subject.disabled).toBeTrue();

		subject.disabled = false;
		expect(subject).not.toHaveAttribute("disabled");
		expect(subject.disabled).toBeFalse();

		subject.setAttribute("disabled", "");
		expect(subject.disabled).toBeTrue();
	});
});
