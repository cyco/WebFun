import { EventTarget } from "src/util";
import MenuWindow from "./components/menu-window";

let sharedMenuStack: MenuStack = null;

class MenuStack extends EventTarget {
	private baseIndex: number = 1001;
	private _stack: MenuWindow[] = [];
	private _overlay: HTMLElement;

	constructor() {
		super();

		this._overlay = document.createElement("div");
		this._overlay.style.backgroundColor = "black";
		this._overlay.style.opacity = "0";
		this._overlay.style.zIndex = `${this.baseIndex}`;
		this._overlay.style.top = "0";
		this._overlay.style.left = "0";
		this._overlay.style.bottom = "0";
		this._overlay.style.right = "0";
		this._overlay.style.width = "auto";
		this._overlay.style.height = "auto";
		this._overlay.style.position = "fixed";
		this._overlay.addEventListener("mousedown", () => MenuStack.sharedStack.clear());
	}

	static get sharedStack() {
		return (sharedMenuStack = sharedMenuStack || new MenuStack());
	}

	get size() {
		return this._stack.length;
	}

	push(menu: MenuWindow): void {
		this._stack.push(menu);
		menu.style.zIndex = `${this.baseIndex + this._stack.length}`;
		if (this._stack.length === 1) {
			document.body.appendChild(this._overlay);
		}
		document.body.appendChild(menu);
	}

	pop(menu: MenuWindow): void {
		let index = this._stack.indexOf(menu);
		if (index === -1) return;

		for (let i = this._stack.length; i > index; i--) {
			let menu = this._stack[i - 1];
			menu.close();
			this._stack.pop();
		}

		if (this._stack.length === 0) {
			this._overlay.remove();
		}
	}

	clear(): void {
		while (this._stack.length) {
			this.pop(this._stack.last());
		}
	}
}

export default MenuStack;
