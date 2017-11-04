import { Point } from "src/util";
import MenuStack from "../menu-stack";
import MenuView from "./menu-view";
import "./menu-window.scss";

class MenuWindow extends MenuView {
	public static TagName = "wf-menu-window";

	show(location: Point|Element, stack = MenuStack.sharedStack) {
		let minWidth: number = null;
		let origin: Point;

		if (location instanceof Point) {
			origin = location;
		}

		if (location instanceof Element) {
			const box = location.getBoundingClientRect();
			origin = new Point(box.left, box.bottom + 1);
			minWidth = box.width;
		}

		if (!origin) {
			throw new TypeError("Expected location to be either Point or Element");
		}

		this.style.left = `${origin.x}px`;
		this.style.top = `${origin.y}px`;

		if (minWidth) {
			this.style.minWidth = `${minWidth}px`;
		}

		stack.push(this);
	}
}

export default MenuWindow;
