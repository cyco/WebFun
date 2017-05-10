import Point from "/util/point";
import MenuView from "./menu-view";
import MenuStack from "../menu-stack";

export default class MenuWindow extends MenuView {
	static get TagName(){
		return 'wf-menu-window';
	}
	
	connectedCallback(){
		super.connectedCallback();
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

		this.style.left = x + "px";
		this.style.top = y + "px";
		if (minWidth) {
			this.style.minWidth = minWidth + "px";
		}

		MenuStack.sharedStack.push(this);
	}
}