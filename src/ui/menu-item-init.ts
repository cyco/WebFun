import Menu from "./menu";
import MenuItem from "./menu-item";

declare interface MenuItemInit {
	title: string;
	state: number;
	callback: Function;
	enabled: boolean|Function,
	submenu: Menu|MenuItem[]|Partial<MenuItemInit>[];
	mnemonic: number;
}

export default MenuItemInit;
