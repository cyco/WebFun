import { NodeList } from "std/dom";
import render from "test/helpers/render";

describe("WebFun.Extension.NodeList.find", () => {
	let subject;
	beforeAll(() => {
		subject = render(`<div><span></span><span class="second"></span><span class="third"></span></div>`)
			.childNodes;
	});

	it("is a function extending the NodeList prototype", () => {
		expect(subject).toBeInstanceOf(NodeList);
		expect(subject.find).toBeFunction();
	});

	it("is used to find the first node in the collection to satisfy a predicate", () => {
		const node = subject.find(node => node.classList.contains("second"));
		expect(node).toBe(subject[1]);
	});

	it("returns null if no element in the collection matches the predicate", () => {
		expect(subject.find(() => false)).toBe(null);
	});
});
