import Component from "./component";
import { iterate } from "src/util";

class ComponentJSXRenderer {
	render(thing: string | (typeof Component) | Node, props: any, ...children: any[]) {
		let node: Node;

		if (typeof thing === "string") {
			node = document.createElement(thing);
		} else if (thing instanceof Function) {
			node = document.createElement(thing.tagName);
		} else if (thing instanceof Node) return Node;

		if (props) {
			for (const [key, value] of iterate(props)) {
				(<any>node)[key] = value;
			}
		}

		if (children) {
			children
				.filter(c => c !== false)
				.forEach((c: any) =>
					node.appendChild(typeof c === "string" ? document.createTextNode(c) : c)
				);
		}

		return node;
	}
}

export default ComponentJSXRenderer;
