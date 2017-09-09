import { EventTarget } from "src/util";
import Menu from "./menu";

export const State = {
	None: 0,
	On: 1,
	Off: 2,
	Mixed: 3
};

class MenuItem extends EventTarget {
	constructor(item = {}) {
		super();

		this.title = item.title || "";
		this.state = item.state || State.None;
		this.callback = item.callback || null;
		this._enabled = item.enabled !== undefined ? item.enabled : true;
		this.submenu = null;
		if (item.submenu) {
			this.submenu = item.submenu instanceof Menu ? item.submenu : new Menu(item.submenu);
		}
		this.mnemonic = item.mnemonic || "";
	}

	get enabled() {
		if (!this.callback && !this.submenu) return false;

		if (this._enabled instanceof Function)
			return this._enabled();

		return this._enabled;
	}

	set enabled(flag) {
		this._enabled = flag;
	}

	get hasSubmenu() {
		return !!this.submenu;
	}
}

export default MenuItem;

const separator = new MenuItem();
separator.isSeparator = true;
export const Separator = separator;
