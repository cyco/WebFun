import MenuItemInit from "./menu-item-init";
import State from "./menu-item-state";

const MenuItemDefaults: MenuItemInit = {
	title: "",
	state: State.Off,
	callback: null,
	mnemonic: undefined,
	submenu: null,
	enabled: true,
	beta: false
};

export default MenuItemDefaults;
