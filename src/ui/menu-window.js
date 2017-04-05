import Point from "/util/point";
import MenuView from "./menu-view";
import MenuStack from "./menu-stack";

export default class MenuWindow extends MenuView {
	constructor(menu, element) {
		super(menu, element);
		this.element.classList.add("menu-window");
	}

	show(location) {
		let x,
			y,
			minWidth;
		if (location instanceof Point) {
			x = location.x;
			y = location.y;
		} else if (location instanceof Node) {
			const box = location.getBoundingClientRect();
			x = box.left;
			y = box.bottom + 1;
			minWidth = box.width;
		}

		this.element.style.left = x + "px";
		this.element.style.top = y + "px";
		if (minWidth) {
			this.element.style.minWidth = minWidth + "px";
		}

		MenuStack.sharedStack.push(this);
	}
}