import { EventTarget } from "src/util";
import Menu from "./menu";
import MenuItemDefaults from "./menu-item-defaults";
import MenuItemInit from "./menu-item-init";
import State from "./menu-item-state";
import MenuItemState from "./menu-item-state";

class MenuItem extends EventTarget {
	public static readonly State = State;
	public title: string;
	private readonly _state: number | (() => MenuItemState);
	public callback: () => void;
	private _submenu: Menu;
	public mnemonic: number;
	public isSeparator: boolean = false;
	private _enabled: boolean | (() => boolean);
	private readonly _beta: boolean;

	constructor(item: Partial<MenuItemInit> = {}) {
		super();

		const options = Object.assign({}, MenuItemDefaults, item);

		this.title = options.title;
		this._state = options.state;
		this.callback = options.callback;
		this._enabled = options.enabled;
		this._beta = options.beta;
		if (options.submenu) {
			this.submenu = options.submenu instanceof Menu ? options.submenu : new Menu(options.submenu);
		}
		this.mnemonic = options.mnemonic;
	}

	get enabled(): boolean {
		if (!this.callback && !this.hasSubmenu) return false;
		if (this._enabled instanceof Function) return this._enabled();

		return this._enabled;
	}

	set enabled(flag: boolean) {
		this._enabled = flag;
	}

	get hasSubmenu(): boolean {
		return !!this.submenu;
	}

	get state(): MenuItemState {
		if (this._state instanceof Function) return this._state();
		return this._state;
	}

	get beta(): boolean {
		return this._beta;
	}

	set submenu(m: Menu) {
		this._submenu = m;
	}

	get submenu(): Menu {
		return this._submenu;
	}
}

const Separator = new MenuItem();
Separator.isSeparator = true;

export default MenuItem;
export { State, MenuItemInit, Separator };
