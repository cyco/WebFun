import { HTMLCollection } from "std/dom";
import render from "test-helpers/render";

describe("WebFun.Extension.HTMLCollection.indexOf", () => {
	let subject;
	beforeAll(() => {
		subject = render(`<div><span></span><span class="second"></span><span class="third"></span></div>`)
			.children;
	});

	it("is a function extending the HTMLCollection prototype", () => {
		expect(subject).toBeInstanceOf(HTMLCollection);
		expect(subject.indexOf).toBeFunction();
	});

	it("is used to indexOf determine where something is in an HTMLCollection", () => {
		const node = subject[1];
		expect(subject.indexOf(node)).toBe(1);

		const missingNode = document.createElement("span");
		expect(subject.indexOf(missingNode)).toBe(-1);
	});
});
