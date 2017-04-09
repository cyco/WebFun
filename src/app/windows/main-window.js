import { Window, View } from "/ui";
import { AmmoView, HealthView, InventoryView, LocationView, WeaponView } from "/app/ui";

export default class extends Window {
	constructor() {
		super();
		this.element.classList.add("main-window");

		this._main = new View();
		this._main.element.classList.add("main");
		this.content.appendChild(this._main.element);

		this._sidebar = new View();
		this._sidebar.element.classList.add("sidebar");

		this._inventoryView = new InventoryView();
		this._sidebar.element.appendChild(this._inventoryView.element);

		const group = new View();
		group.element.classList.add("group");

		this._locationView = new LocationView();
		group.element.appendChild(this._locationView.element);

		const equipment = new View();
		equipment.element.classList.add("equipment");
		this._ammoView = new AmmoView();
		equipment.element.appendChild(this._ammoView.element);
		this._weaponView = new WeaponView();
		equipment.element.appendChild(this._weaponView.element);
		group.element.appendChild(equipment.element);

		this._healthView = new HealthView();
		group.element.appendChild(this._healthView.element);

		this._sidebar.element.appendChild(group.element);
		this.content.appendChild(this._sidebar.element);
	}

	get mainContent() {
		return this._main.element;
	}
}
