import { Window } from "/ui";
import { Group } from '/ui/components';
import { Location, Health, Ammo, Weapon, Inventory } from '/app/ui/components';

export default class extends Window {
	constructor() {
		super();
		this.element.classList.add("main-window");

		this._main = document.createElement(Group.TagName);
		this._main.classList.add("main");
		this.content.appendChild(this._main);

		this._sidebar = document.createElement(Group.TagName);
		this._sidebar.classList.add("sidebar");

		this._inventory = document.createElement(Inventory.TagName);
		this._sidebar.appendChild(this._inventory);

		const group = document.createElement(Group.TagName);
		this._locationView = document.createElement(Location.TagName);
		group.appendChild(this._locationView);

		const equipment = document.createElement(Group.TagName);
		equipment.classList.add("equipment");
		this._ammoView = document.createElement(Ammo.TagName);
		equipment.appendChild(this._ammoView);
		this._weaponView = document.createElement(Weapon.TagName);
		equipment.appendChild(this._weaponView);
		group.appendChild(equipment);

		this._healthView = document.createElement(Health.TagName);
		group.appendChild(this._healthView);

		this._sidebar.appendChild(group);
		this.content.appendChild(this._sidebar);
	}

	get mainContent() {
		return this._main;
	}
}
