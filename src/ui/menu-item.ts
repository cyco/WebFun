import { EventTarget } from "src/util";
import Menu from "./menu";

export const State = {
	None: 0,
	On: 1,
	Off: 2,
	Mixed: 3
};

declare interface MenuItemInit {
	title: string;
	state: number;
	callback: Function;
	enabled: boolean|Function,
	submenu: Menu|MenuItem[]|Partial<MenuItemInit>[];
	mnemonic: number;
}

const MenuItemDefaults: MenuItemInit = {
	title: "",
	state: State.Off,
	callback: null,
	mnemonic: 0,
	submenu: null,
	enabled: true
};

class MenuItem extends EventTarget {
	public title: string;
	public state: number;
	public callback: Function;
	private _enabled: boolean|Function;
	public submenu: Menu;
	public mnemonic: number;
	public isSeparator: boolean = false;

	constructor(item: Partial<MenuItemInit> = {}) {
		super();

		const options = Object.assign({}, MenuItemDefaults, item);

		this.title = options.title;
		this.state = options.state;
		this.callback = options.callback;
		this._enabled = options.enabled;
		this.submenu = null;
		if (options.submenu) {
			this.submenu = options.submenu instanceof Menu ? options.submenu : new Menu(options.submenu);
		}
		this.mnemonic = options.mnemonic;
	}

	get enabled(): boolean {
		if (!this.callback && !this.submenu) return false;

		if (this._enabled instanceof Function)
			return this._enabled();

		return this._enabled;
	}

	set enabled(flag) {
		this._enabled = flag;
	}

	get hasSubmenu(): boolean {
		return !!this.submenu;
	}
}

export default MenuItem;

const Separator = new MenuItem();
Separator.isSeparator = true;

export { MenuItemInit, Separator };
