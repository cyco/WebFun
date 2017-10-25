import { Ammo, Health, Inventory, Location, Weapon } from "../ui";
import { Direction } from "../ui/location";
import { default as Engine, Events } from "src/engine/engine";
import { Hero } from "src/engine";
import { Group, Window } from "src/ui/components";
import World from "src/engine/generation/world";
import { Zone } from "src/engine/objects";
import InventoryComponent from "../ui/inventory";
import "./main-window.scss";

class MainWindow extends Window {
	public static TagName = "wf-main-window";
	private _ammoView: Ammo;
	private _engine: Engine = null;
	private _handlers: {[_: string]: Function};
	private _healthView: Health;
	private _inventory: InventoryComponent;
	private _locationView: Location;
	private _main: Group;
	private _sidebar: Group;
	private _weaponView: Weapon;

	constructor() {
		super();

		this._main = <Group>document.createElement(Group.TagName);
		this._main.classList.add("main");
		this.content.appendChild(this._main);

		this._sidebar = <Group>document.createElement(Group.TagName);
		this._sidebar.classList.add("sidebar");

		this._inventory = <Inventory>document.createElement(Inventory.TagName);
		this._sidebar.appendChild(this._inventory);

		const group = document.createElement(Group.TagName);
		this._locationView = <Location>document.createElement(Location.TagName);
		group.appendChild(this._locationView);

		const equipment = document.createElement(Group.TagName);
		equipment.classList.add("equipment");
		this._ammoView = <Ammo>document.createElement(Ammo.TagName);
		equipment.appendChild(this._ammoView);
		this._weaponView = <Weapon>document.createElement(Weapon.TagName);
		equipment.appendChild(this._weaponView);
		group.appendChild(equipment);

		this._healthView = <Health>document.createElement(Health.TagName);
		group.appendChild(this._healthView);

		this._sidebar.appendChild(group);
		this.content.appendChild(this._sidebar);

		this._buildEventHandlers();

		this.onclose = () => this._engine && this._engine.metronome.stop();
	}

	get engine(): Engine {
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

	_updateLocation({zone, world}: {zone: Zone, world: World}) {
		let mask = Direction.None;
		const location = world.locationOfZone(zone);
		if (!location || !world) {
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
