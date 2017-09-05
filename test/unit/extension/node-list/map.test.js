import { NodeList } from "std.dom";
import sandboxed from "test-helpers/dom-sandbox";
import map from "src/extension/node-list/map";

describe("NodeList.map", sandboxed((sand) => {
	it("extends the NodeList prototype", () => {
		expect(typeof map).toBe("function");
		expect(typeof NodeList.prototype.map).toBe("function");
	});

	it("works just like map on an Array", () => {
		let e1 = document.createElement("div");
		e1.className = "selectMe";
		e1.appendChild(document.createTextNode("test"));
		sand.box.appendChild(e1);

		let e2 = document.createElement("div");
		e2.className = "selectMe";
		e2.appendChild(document.createTextNode("values"));
		sand.box.appendChild(e2);

		let nodeList = sand.box.querySelectorAll(".selectMe");
		expect(typeof nodeList.map).toBe("function");
		expect(nodeList.length).toBe(2);

		let result = map.call(nodeList, function (node) {
			return node.textContent;
		});
		expect(result).toEqual([ "test", "values" ]);
	});
}));
