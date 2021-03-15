import "./abstract-menu-window.scss";

import AbstractMenuView from "./abstract-menu-view";
import MenuStack from "../menu-stack";
import { Point } from "src/util";

abstract class AbstractMenuWindow extends AbstractMenuView {
	protected stack: MenuStack = null;

	show(location: Point | Element, stack = MenuStack.sharedStack): void {
		let minWidth: number = null;
		let origin: Point;

		if (location instanceof Point) {
			origin = location;
		}

		if (location instanceof Element) {
			const box = location.getBoundingClientRect();
			origin = new Point(box.left, box.bottom + 1).add(window.scrollX, window.scrollY);
			minWidth = box.width;
		}
		console.assert(!!origin, "Expected location to be either Point or Element");

		this.style.left = `${origin.x}px`;
		this.style.top = `${origin.y}px`;

		if (minWidth) {
			this.style.minWidth = `${minWidth}px`;
		}

		stack.push(this);
		this.stack = stack;
	}

	close(): void {
		super.close();
		this.stack = null;
	}
}

export default AbstractMenuWindow;
