import { HTMLCollection } from "std.dom";
import render from "test-helpers/render";

describe("HTMLCollection.map", () => {
	let subject;
	beforeAll(() => {
		subject = render(`<div><span class="first"></span><span class="second"></span><span class="third"></span></div>`).children;
	});

	it("is a function extending the HTMLCollection prototype", () => {
		expect(subject).toBeInstanceOf(HTMLCollection);
		expect(subject.map).toBeFunction();
	});

	it("is used to create an array by applying a funtion to each node in a collection", () => {
		const result = subject.map(node => node.className);
		expect(result).toEqual([ "first", "second", "third" ]);
	});
});

