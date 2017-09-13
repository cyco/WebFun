import { EventTarget } from "src/util";
import MenuWindow from "./components/menu-window";

let sharedMenuStack: MenuStack = null;

class MenuStack extends EventTarget {
	static get sharedStack() {
		return (sharedMenuStack = sharedMenuStack || new MenuStack());
	}

	private baseIndex: number = 1001;
	private _stack: MenuWindow[] = [];

	push(menu: MenuWindow): void {
		this._stack.push(menu);
		menu.style.zIndex = `${this.baseIndex + this._stack.length}`;
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
	}

	clear(): void {
		while (this._stack.length) {
			this.pop(this._stack.last());
		}
	}

	get size(){
		return this._stack.length;
	}
}

export default MenuStack;
