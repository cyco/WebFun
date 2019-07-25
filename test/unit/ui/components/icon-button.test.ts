import IconButton from "src/ui/components/icon-button";
import render from "test/helpers/render";

describeComponent(IconButton, () => {
	let subject: IconButton;

	it("is a custom element", () => {
		expect(IconButton).toBeCustomElement();
	});

	it("uses the tag name 'wf-icon-button'", () => {
		expect(IconButton.tagName).toBe("wf-icon-button");
	});

	it("takes a font-awesome icon name in the icon attribute", () => {
		subject = render(IconButton, { icon: "test" }) as IconButton;
		expect(subject.icon).toBe("test");
		expect(subject.querySelector(".fa-test")).not.toBeNull();

		subject.icon = "my-new-icon";
		expect(subject.querySelector(".fa-my-new-icon")).not.toBeNull();
	});

	it("can be disabled", () => {
		subject = render(IconButton, {}, ["disabled"]) as IconButton;
		expect(subject).toHaveAttribute("disabled");
		expect(subject.disabled).toBeTrue();

		subject.remove();
		document.body.appendChild(subject);

		subject.disabled = false;
		expect(subject).not.toHaveAttribute("disabled");
		expect(subject.disabled).toBeFalse();

		subject.setAttribute("disabled", "");
		expect(subject.disabled).toBeTrue();

		subject.disabled = false;
		expect(subject).not.toHaveAttribute("disabled");

		subject.disabled = true;
		expect(subject).toHaveAttribute("disabled");

		subject.remove();
	});
});
