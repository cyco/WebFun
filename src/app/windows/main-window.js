import { Window, Group } from '/ui/components';
import { Location, Health, Ammo, Weapon, Inventory } from '/app/ui/components';
import { Events } from '/engine/engine';

export default class extends Window {
	static get TagName() {
		return 'wf-main-window';
	}

	constructor() {
		super();

		this._engine = null;
		this._handlers = null;

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

		this._buildEventHandlers();
	}

	_buildEventHandlers() {
		console.assert(!this._handlers || !this._engine);

		this._handlers = {};
		this._handlers[Events.AmmoChanged] = () => this._updateAmmo();
		this._handlers[Events.InventoryChanged] = () => this._updateInventory();
		this._handlers[Events.WeaponChanged] = () => this._updateWeapon();
		this._handlers[Events.LocationChanged] = () => this._updateLocation();
		this._handlers[Events.HealthChanged] = () => this._updateHealth();
	}

	set engine(e) {
		if (this._engine) {
			this._handlers.each((event, handler) => this._engine.removeEventListener(event, handler));
		}

		this._engine = e;

		if (this._engine) {
			this._handlers.each((event, handler) => this._engine.addEventListener(event, handler));
		}

		this._handlers.each((_, handler) => handler());
	}

	get engine() {
		return this.engine;
	}

	get mainContent() {
		return this._main;
	}

	_updateAmmo() {
	}

	_updateWeapon() {
	}

	_updateLocation() {
	}

	_updateInventory() {
	}

	_updateHealth() {
	}
}
