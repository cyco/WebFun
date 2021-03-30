import MenuItemInit from "./menu-item-init";
import State from "./menu-item-state";

const MenuItemDefaults: MenuItemInit = {
	title: "",
	state: State.None,
	callback: null,
	mnemonic: undefined,
	submenu: null,
	enabled: true,
	beta: false
};

export default MenuItemDefaults;
