import "./fullscreen-main-window.scss";

import { Ammo, Health, Inventory, Location, Weapon } from "../ui";
import { OnscreenPad, OnscreenButton } from "../ui";
import { default as Engine, Events } from "src/engine/engine";

import { AbstractWindow } from "src/ui/components";
import { Direction } from "../ui/location";
import { Hero } from "src/engine";
import World from "src/engine/world";
import { Zone } from "src/engine/objects";
import { Point } from "src/util";
import { Button } from "src/ui/components";

class FullscreenMainWindow extends AbstractWindow {
	public static readonly tagName = "wf-fullscreen-main-window";
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

		this.closable = false;

		this.content = (
			<div>
				<div className="main" />
				<div className="actions">
					<Button label="Inventory" onclick={(e: Event) => this.toggleInventory(e)}></Button>
					<Button label="Map" disabled></Button>
					<Button label="Options"></Button>
				</div>
				<div className="status">
					<Location />
					<div className="equipment">
						<Ammo />
						<Weapon />
					</div>
					<Health />
				</div>
				<Inventory />
				<div className="controls">
					<OnscreenPad />
					<div className="buttons">
						<OnscreenButton className="drag" label="Drag" />
						<OnscreenButton className="shoot" label="Shoot" />
					</div>
				</div>
			</div>
		);
	}

	get engine(): Engine {
		return this._engine;
	}

	set engine(e) {
		if (this._engine) {
			const hero = this._engine.hero;
			this._handlers.each((event: any, handler: any) =>
				this._engine.removeEventListener(event, handler)
			);
			hero.removeEventListener(Hero.Event.HealthChanged, this._handlers.healthChanged);
			hero.removeEventListener(Hero.Event.WeaponChanged, this._handlers[Events.WeaponChanged]);
			hero.removeEventListener(Hero.Event.AmmoChanged, this._handlers[Events.AmmoChanged]);
		}

		this._engine = e;

		if (this._engine) {
			const hero = this._engine.hero;
			hero.addEventListener(Hero.Event.HealthChanged, this._handlers.healthChanged);
			hero.addEventListener(Hero.Event.WeaponChanged, this._handlers[Events.WeaponChanged]);
			hero.addEventListener(Hero.Event.AmmoChanged, this._handlers[Events.AmmoChanged]);
			this._handlers.each((event: any, handler: any) => this._engine.addEventListener(event, handler));
		}

		this.applyCurrentValues();
	}

	private applyCurrentValues() {
		const engine = this._engine;

		this.inventory.inventory = engine ? engine.inventory : null;
		this.ammo.ammo = engine ? engine.hero.ammo : 0;
		this.weapon.weapon = engine ? engine.hero.weapon : null;
	}

	get mainContent() {
		return this.content.querySelector(".main");
	}

	private _updateAmmo() {
		const weapon = this.engine.hero.weapon;
		const current = this.engine.hero.ammo;
		const max = this.engine.type.getMaxAmmo(weapon);
		this.ammo.ammo = weapon ? current / max : 0;
	}

	private _updateWeapon() {
		this.weapon.weapon = this.engine.hero.weapon;
	}

	private _updateLocation({ zone, world }: { zone: Zone; world: World }) {
		const locationView = this.content.querySelector(Location.tagName) as Location;

		let mask = Direction.None;

		if (!world) {
			locationView.mask = mask;
			return;
		}

		const location = world.findLocationOfZone(zone);
		if (!location) {
			locationView.mask = mask;
			return;
		}
		const getZone = (pos: Point): Zone => (world.bounds.contains(pos) ? world.at(pos).zone : null);

		mask |= getZone(location.byAdding(-1, 0)) ? Direction.West : 0;
		mask |= getZone(location.byAdding(1, 0)) ? Direction.East : 0;
		mask |= getZone(location.byAdding(0, -1)) ? Direction.North : 0;
		mask |= getZone(location.byAdding(0, 1)) ? Direction.South : 0;

		locationView.mask = mask;
	}

	private _updateHealth() {
		const healthView = this.content.querySelector(Health.tagName) as Health;
		healthView.health = this._engine.hero.health;
	}

	private toggleInventory(e: Event) {
		console.log("toggleInventory", e);
		const button = e.target as Button;
		button.active = !button.active;
		if (button.active) this.inventory.classList.add("slide-up");
		else this.inventory.classList.remove("slide-up");
	}

	private toggleMenu(e: CustomEvent) {
		console.log("toggleMenu", e);
		const button = e.target as Button;
		button.active = !button.active;
	}

	public get inventory() {
		return this.querySelector(Inventory.tagName) as Inventory;
	}

	public get weapon() {
		return this.querySelector(Weapon.tagName) as Weapon;
	}

	public get ammo() {
		return this.querySelector(Ammo.tagName) as Ammo;
	}
}

export default FullscreenMainWindow;
