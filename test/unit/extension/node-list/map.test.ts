import map from "src/extension/node-list/map";
import { NodeList } from "src/std/dom";
import sandboxed from "test/helpers/dom-sandbox";

describe(
	"WebFun.Extension.NodeList.map",
	sandboxed(sand => {
		it("extends the NodeList prototype", () => {
			expect(typeof map).toBe("function");
			expect(typeof NodeList.prototype.map).toBe("function");
		});

		it("works just like map on an Array", () => {
			const e1 = document.createElement("div");
			e1.className = "selectMe";
			e1.appendChild(document.createTextNode("test"));
			sand.box.appendChild(e1);

			const e2 = document.createElement("div");
			e2.className = "selectMe";
			e2.appendChild(document.createTextNode("values"));
			sand.box.appendChild(e2);

			const nodeList = sand.box.querySelectorAll(".selectMe");
			expect(typeof (nodeList as any).map).toBe("function");
			expect(nodeList.length).toBe(2);

			const result = map.call(nodeList, function (node: any) {
				return node.textContent;
			});
			expect(result).toEqual(["test", "values"]);
		});
	})
);
