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
	public static tagName = "wf-main-window";
	private _ammoView: Ammo;
	private _engine: Engine = null;
	private _handlers: { [_: string]: EventListener };
	private _healthView: Health;
	private _inventory: InventoryComponent;
	private _locationView: Location;
	private _main: Group;
	private _sidebar: Group;
	private _weaponView: Weapon;

	constructor() {
		super();

		this.autosaveName = "main-window";
		this._main = <Group>document.createElement(Group.tagName);
		this._main.classList.add("main");
		this.content.appendChild(this._main);

		this._sidebar = <Group>document.createElement(Group.tagName);
		this._sidebar.classList.add("sidebar");

		this._inventory = <Inventory>document.createElement(Inventory.tagName);
		this._sidebar.appendChild(this._inventory);

		const group = document.createElement(Group.tagName);
		this._locationView = <Location>document.createElement(Location.tagName);
		group.appendChild(this._locationView);

		const equipment = document.createElement(Group.tagName);
		equipment.classList.add("equipment");
		this._ammoView = <Ammo>document.createElement(Ammo.tagName);
		equipment.appendChild(this._ammoView);
		this._weaponView = <Weapon>document.createElement(Weapon.tagName);
		equipment.appendChild(this._weaponView);
		group.appendChild(equipment);

		this._healthView = <Health>document.createElement(Health.tagName);
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
			this._handlers.each((event: any, handler: any) =>
				this._engine.removeEventListener(event, handler)
			);
			this._engine.hero.removeEventListener(Hero.Event.HealthChanged, this._handlers.healthChanged);
		}

		this._engine = e;
		this._inventory.inventory = this._engine ? this._engine.inventory : null;

		if (this._engine) {
			this._engine.hero.addEventListener(Hero.Event.HealthChanged, this._handlers.healthChanged);
			this._handlers.each((event: any, handler: any) => this._engine.addEventListener(event, handler));
		}
	}

	get mainContent() {
		return this._main;
	}

	private _buildEventHandlers() {
		this._handlers = {};
		this._handlers[Events.AmmoChanged] = () => this._updateAmmo();
		this._handlers[Events.WeaponChanged] = () => this._updateWeapon();
		this._handlers[Events.LocationChanged] = ({ detail }: CustomEvent) => this._updateLocation(detail);

		this._handlers.healthChanged = () => this._updateHealth();
	}

	private _updateAmmo() {}

	private _updateWeapon() {}

	private _updateLocation({ zone, world }: { zone: Zone; world: World }) {
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

	private _updateHealth() {
		this._healthView.health = this._engine.hero.health;
	}
}

export default MainWindow;
