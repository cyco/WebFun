import indexOf from "src/extension/node-list/index-of";
import { NodeList } from "std.dom";
import render from "test-helpers/render";

describe("WebFun.Extension.NodeList.indexOf", () => {
	it("extends the NodeList prototype", () => {
		expect(typeof indexOf).toBe("function");
		expect(typeof NodeList.prototype.indexOf).toBe("function");
	});

	it("behaves like indexOf in an array", () => {
		const tree = render("<div><span></span><span></span></div>");
		const span = tree.querySelector("span");
		const nodes = tree.querySelectorAll("span");

		expect(nodes.indexOf(span)).toBe(0);

		const missingNode = document.createElement("span");
		expect(nodes.indexOf(missingNode)).toBe(-1);
	});
});
