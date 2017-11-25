import MenuItem from "./menu-item";
import WindowManager from "./window-manager";
import MenuItemState from "./menu-item-state";
import { Window } from "./components";
import Menu from "./menu";

class WindowMenuItem extends MenuItem {
	private windowManager: WindowManager;

	constructor(windowManager: WindowManager) {
		super();

		this.title = "Window";
		this.mnemonic = 0;
		this.windowManager = windowManager;
	}

	set submenu(s) {
		/* disable overwriting submenu*/
	}

	get submenu(): Menu {
		return new Menu(this.windowManager.windows.map(w => this._buildWindowItem(w)));
	}

	_buildWindowItem(window: Window): MenuItem {
		return new MenuItem({
			title: window.title,
			state: window === this.windowManager.topMostWindow ? MenuItemState.On : MenuItemState.Off,
			callback: () => this.windowManager.focus(window)
		});
	}

	get hasSubmenu(): boolean {
		return true;
	}
}

export default WindowMenuItem;
