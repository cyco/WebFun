import forEach from "src/extension/html-collection/for-each";
import { NodeList } from "src/std/dom";
import sandboxed from "test/helpers/dom-sandbox";

describe(
	"WebFun.Extension.HTMLCollection.forEach",
	sandboxed(sand => {
		it("extends the NodeList prototype", () => {
			expect(typeof forEach).toBe("function");
			expect((HTMLCollection.prototype as any).forEach).toBeFunction();
		});

		it("works just like forEach on an Array", () => {
			const e1 = document.createElement("div");
			e1.className = "selectMe";
			sand.box.appendChild(e1);
			const e2 = document.createElement("div");
			e2.className = "selectMe";
			sand.box.appendChild(e2);

			const collection = sand.box.children as HTMLCollectionOf<any>;
			expect(collection.forEach).toBeFunction();
			expect(collection.length).toBe(2);

			let callCount = 0;
			forEach.call(collection, () => {
				callCount++;
			});
			expect(callCount).toBe(collection.length);
		});
	})
);
