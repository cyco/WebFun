import forEach from "src/extension/node-list/for-each";
import { NodeList } from "std/dom";
import sandboxed from "test/helpers/dom-sandbox";

describe(
	"WebFun.Extension.NodeList.forEach",
	sandboxed(sand => {
		it("extends the NodeList prototype", () => {
			expect(typeof forEach).toBe("function");
			expect(typeof NodeList.prototype.forEach).toBe("function");
		});

		it("works just like forEach on an Array", () => {
			const e1 = document.createElement("div");
			e1.className = "selectMe";
			sand.box.appendChild(e1);
			const e2 = document.createElement("div");
			e2.className = "selectMe";
			sand.box.appendChild(e2);

			const nodeList = sand.box.querySelectorAll(".selectMe");
			expect(nodeList.forEach).toBeFunction();
			expect(nodeList.length).toBe(2);

			let callCount = 0;
			forEach.call(nodeList, () => {
				callCount++;
			});
			expect(callCount).toBe(nodeList.length);
		});
	})
);
