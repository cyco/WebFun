import { HTMLCollection } from "src/std/dom";
import render from "test/helpers/render";

describe("WebFun.Extension.HTMLCollection.map", () => {
	let subject: HTMLCollectionOf<any>;
	beforeAll(() => {
		subject = render(
			`<div><span class="first"></span><span class="second"></span><span class="third"></span></div>`
		).children as HTMLCollectionOf<any>;
	});

	it("is a function extending the HTMLCollection prototype", () => {
		expect(subject).toBeInstanceOf(HTMLCollection);
		expect(subject.map).toBeFunction();
	});

	it("is used to create an array by applying a function to each node in a collection", () => {
		const result = subject.map(node => node.className);
		expect(result).toEqual(["first", "second", "third"]);
	});
});
