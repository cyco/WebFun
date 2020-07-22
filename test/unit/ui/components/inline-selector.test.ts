import { InlineSelector } from "src/ui/components";
import { describeComponent } from "test/helpers";
import { dispatch } from "src/util";

describeComponent(InlineSelector, () => {
	let subject: InlineSelector<string>;
	beforeEach(
		() =>
			(subject = render(InlineSelector, {
				options: [
					{ label: "Value 1", value: "v1" },
					{ label: "Value 2", value: "v2" }
				],
				value: "v2"
			}) as InlineSelector<string>)
	);
	afterEach(() => subject.remove());

	it("shows the selected option", () => {
		expect(subject.textContent).toContain("Value 2");
	});

	it("updates the value property and label", () => {
		expect(subject.value).toBe("v2");
		subject.value = "v1";
		expect(subject.textContent).toContain("Value 1");
	});

	it("falls back to the first value if a bogus value is set", () => {
		subject.value = "i don't exist";
		expect(subject.textContent).toContain("Value 1");
	});

	describe("when the element is clicked", () => {
		let event: MouseEvent;
		let selectElement: HTMLSelectElement;
		beforeEach(() => {
			selectElement = document.createElement("select");
			spyOn(selectElement, "open");
			const createElement = document.createElement;
			spyOn(document, "createElement").and.callFake((tag: string) => {
				if (tag === "select") return selectElement;
				return createElement.call(document, tag);
			});

			event = {
				type: "mousedown",
				target: subject,
				preventDefault: jasmine.createSpy(),
				stopPropagation: jasmine.createSpy(),
				stopImmediatePropagation: jasmine.createSpy()
			} as any;
			subject.handleEvent(event);
		});

		it("shows a real select element", () => {
			expect(selectElement.parentNode).toBe(subject);
			expect(selectElement.value).toEqual("1");
			expect(selectElement.childElementCount).toBe(2);
			expect(selectElement.children[0].textContent).toEqual("Value 1");
			expect(selectElement.children[1].textContent).toEqual("Value 2");
		});

		it("tries to open the newly created select element in the next loop", async () => {
			await dispatch(() => void 0);
			expect(selectElement.open).toHaveBeenCalled();
		});

		describe("and the menu is open", () => {
			beforeEach(async () => {
				await dispatch(() => void 0);
				selectElement.focus();
			});

			describe("and the value is changed", () => {
				let onchangeCallback: jasmine.Spy, onchangeHandler: jasmine.Spy;
				beforeEach(() => {
					onchangeCallback = jasmine.createSpy();
					onchangeHandler = jasmine.createSpy();

					subject.onchange = onchangeCallback;
					subject.addEventListener("change", onchangeHandler);
					selectElement.value = "0";
					selectElement.onchange({ stopPropagation: jasmine.createSpy() } as any);
				});

				it("changes the value", () => {
					expect(subject.value).toEqual("v1");
				});

				it("triggers a change event", () => {
					expect(onchangeHandler).toHaveBeenCalled();
				});

				it("executes the onchange callback", () => {
					expect(onchangeCallback).toHaveBeenCalled();
				});

				it("removes the select element from the dom", () => {
					expect(selectElement.parentNode).toBeNull();
				});
			});

			describe("and the select element loses focus", () => {
				beforeEach(() => selectElement.blur());

				it("removes the select element", () => {
					expect(selectElement.parentNode).toBeNull();
				});
			});
		});
	});
});
