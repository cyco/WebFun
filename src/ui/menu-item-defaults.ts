import MenuItemInit from "./menu-item-init";
import State from "./menu-item-state";

const MenuItemDefaults: MenuItemInit = {
	title: "",
	state: State.Off,
	callback: null,
	mnemonic: 0,
	submenu: null,
	enabled: true
};

export default MenuItemDefaults;
