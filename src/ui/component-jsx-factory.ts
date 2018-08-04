import Component from "./component";
import { iterate } from "src/util";

class ComponentJSXRenderer {
	render(thing: string | (typeof Component) | Node, props: any, ...children: any[]) {
		let node: Node;

		if (typeof thing === "string") {
			node = document.createElement(thing);
		} else if (thing instanceof Function) {
			node = document.createElement(thing.tagName);
		} else if (thing instanceof Node) return thing;

		if (props) {
			for (const [key, value] of iterate(props)) {
				(<any>node)[key] = value;
			}
		}

		if (children) {
			const append = (c: any) => {
				if (typeof c === "string") {
					node.appendChild(document.createTextNode(c));
				} else if (c instanceof Node) {
					node.appendChild(c);
				} else if (c instanceof Array) {
					c.filter((e: any) => e).forEach(append);
				} else {
					console.error("don\t know how to append", c);
				}
			};

			append(children);
		}

		return node;
	}
}

export default ComponentJSXRenderer;
