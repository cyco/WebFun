import Menu from "./menu";
import MenuItem from "./menu-item";

declare interface MenuItemInit {
	title: string;
	state: number | Function;
	callback: Function;
	enabled: boolean | Function;
	mnemonic: number;
	submenu?: Menu | MenuItem[] | Partial<MenuItemInit>[];
	beta: boolean;
}

export default MenuItemInit;
