import Menu from "./menu";
import MenuItem from "./menu-item";
import MenuItemState from "./menu-item-state";

declare interface MenuItemInit {
	title: string;
	state: number | (() => MenuItemState);
	callback: () => void;
	enabled: boolean | (() => boolean);
	mnemonic: number;
	submenu?: Menu | MenuItem[] | Partial<MenuItemInit>[];
	beta: boolean;
}

export default MenuItemInit;
