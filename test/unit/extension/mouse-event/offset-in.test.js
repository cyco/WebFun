import { MouseEvent } from "std/dom";
import offsetIn from "src/extension/mouse-event/offset-in";

describe("WebFun.Extension.MouseEvent.offsetIn", () => {
	it("extends the MouseEvent prototype to determine where an event happend", () => {
		const event = new MouseEvent("click");
		expect(event.offsetIn).toBeFunction();
	});

	it("just returns offset x,y when the node is the current target", () => {
		const node = document.createElement("div");
		const event = { type: "click", offsetX: 5, offsetY: 7, target: node };
		const point = offsetIn.call(event, node);
		expect(point.x).toBe(5);
		expect(point.y).toBe(7);
	});

	it("uses getBoundingClientRect to calculate the offset", () => {
		const eventNode = document.createElement("div");
		const node = document.createElement("div");
		node.style.position = "absolute";
		node.style.top = "5px";
		node.style.left = "7px";
		document.body.appendChild(node);

		const event = { type: "click", clientX: 50, clientY: 70, taret: eventNode };
		const point = offsetIn.call(event, node);
		expect(point.x).toBe(43);
		expect(point.y).toBe(65);

		node.remove();
	});
});
