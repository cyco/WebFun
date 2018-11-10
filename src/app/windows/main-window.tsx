import { Ammo, Health, Inventory, Location, Weapon } from "../ui";
import { Direction } from "../ui/location";
import { default as Engine, Events } from "src/engine/engine";
import { Hero } from "src/engine";
import { AbstractWindow } from "src/ui/components";
import World from "src/engine/generation/world";
import { Zone } from "src/engine/objects";
import InventoryComponent from "../ui/inventory";
import "./main-window.scss";

class MainWindow extends AbstractWindow {
	public static readonly tagName = "wf-main-window";
	private _engine: Engine = null;
	private _handlers = {
		[Events.AmmoChanged]: () => this._updateAmmo(),
		[Events.WeaponChanged]: () => this._updateWeapon(),
		[Events.LocationChanged]: ({ detail }: CustomEvent) => this._updateLocation(detail),
		healthChanged: () => this._updateHealth()
	};

	autosaveName = "main-window";
	onclose = () => this._engine && this._engine.metronome.stop();

	constructor() {
		super();

		this.content.appendChild(<div className="main" />);
		this.content.appendChild(
			<div className="sidebar">
				<Inventory />
				<div>
					<Location />
					<div className="equipment">
						<Ammo />
						<Weapon />
					</div>
					<Health />
				</div>
			</div>
		);
	}

	get engine(): Engine {
		return this._engine;
	}

	set engine(e) {
		const inventoryView = this.content.querySelector(InventoryComponent.tagName) as InventoryComponent;
		const ammoView = this.content.querySelector(Ammo.tagName) as Ammo;
		const weaponView = this.content.querySelector(Weapon.tagName) as Weapon;

		if (this._engine) {
			this._handlers.each((event: any, handler: any) =>
				this._engine.removeEventListener(event, handler)
			);
			this._engine.hero.removeEventListener(Hero.Event.HealthChanged, this._handlers.healthChanged);
			inventoryView.inventory = null;
		}

		this._engine = e;

		if (this._engine) {
			this._engine.hero.addEventListener(Hero.Event.HealthChanged, this._handlers.healthChanged);
			this._handlers.each((event: any, handler: any) => this._engine.addEventListener(event, handler));
			inventoryView.inventory = this._engine ? this._engine.inventory : null;
			ammoView.ammo = e.hero.ammo;
			weaponView.weapon = e.hero.weapon;
		}
	}

	get mainContent() {
		return this.content.querySelector(".main");
	}

	private _updateAmmo() {}

	private _updateWeapon() {}

	private _updateLocation({ zone, world }: { zone: Zone; world: World }) {
		const locationView = this.content.querySelector(Location.tagName) as Location;

		let mask = Direction.None;
		const location = world.locationOfZone(zone);
		if (!location || !world) {
			locationView.mask = mask;
			return;
		}
		mask |= world.getZone(location.byAdding(-1, 0)) ? Direction.West : 0;
		mask |= world.getZone(location.byAdding(1, 0)) ? Direction.East : 0;
		mask |= world.getZone(location.byAdding(0, -1)) ? Direction.North : 0;
		mask |= world.getZone(location.byAdding(0, 1)) ? Direction.South : 0;

		locationView.mask = mask;
	}

	private _updateHealth() {
		const healthView = this.content.querySelector(Health.tagName) as Health;
		healthView.health = this._engine.hero.health;
	}
}

export default MainWindow;
