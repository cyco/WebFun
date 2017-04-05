import MenuWindow from "./menu-window";
export default class SubmenuWindow extends MenuWindow {
	constructor(menu, element) {
		super(element || document.createElement("ul"));
		this.element.classList.add("SubmenuWindow");
	}
}