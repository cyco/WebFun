import { Group, Window } from "src/ui/components";
import { Ammo, Health, Inventory, Location, Weapon } from "src/app/ui/components";
import { Direction } from "src/app/ui/components/location";
import { Events } from "src/engine/engine";
import Hero from "src/engine/hero";
import "./main-window.scss";

class MainWindow extends Window {
	public static TagName = "wf-main-window";
	private _handlers: any;
	private _main: any;
	private _sidebar: any;
	private _inventory: any;
	private _locationView: any;
	private _ammoView: any;
	private _weaponView: any;
	private _healthView: any;
	private _engine: any;

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

	get engine(): any {
		return this._engine;
	}

	set engine(e) {
		if (this._engine) {
			this._handlers.each((event: any, handler: any) => this._engine.removeEventListener(event, handler));
			this._engine.hero.removeEventListener(Hero.Event.HealthChanged, this._handlers.healthChanged);
		}

		this._engine = e;
		this._inventory.inventory = this._engine.inventory;

		if (this._engine) {
			this._engine.hero.addEventListener(Hero.Event.HealthChanged, this._handlers.healthChanged);
			this._handlers.each((event: any, handler: any) => this._engine.addEventListener(event, handler));
		}
	}

	get mainContent() {
		return this._main;
	}

	_buildEventHandlers() {
		console.assert(!this._handlers || !this._engine);

		this._handlers = {};
		this._handlers[Events.AmmoChanged] = () => this._updateAmmo();
		this._handlers[Events.WeaponChanged] = () => this._updateWeapon();
		this._handlers[Events.LocationChanged] = ({detail}: {detail: any}) => this._updateLocation(detail);

		this._handlers.healthChanged = () => this._updateHealth();
	}

	_updateAmmo() {
	}

	_updateWeapon() {
	}

	_updateLocation({zone, world}: {zone: any, world: any}) {
		let mask = Direction.None;
		const location = world.locationOfZone(zone);
		if (!location) {
			this._locationView.mask = mask;
			return;
		}
		mask |= world.getZone(location.byAdding(-1, 0)) ? Direction.West : 0;
		mask |= world.getZone(location.byAdding(1, 0)) ? Direction.East : 0;
		mask |= world.getZone(location.byAdding(0, -1)) ? Direction.North : 0;
		mask |= world.getZone(location.byAdding(0, 1)) ? Direction.South : 0;

		this._locationView.mask = mask;
	}

	_updateHealth() {
		this._healthView.health = this._engine.hero.health;
	}
}

export default MainWindow;
