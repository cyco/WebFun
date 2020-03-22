import "./main-window.scss";

import { Ammo, Health, Inventory as InventoryComponent, Location, Weapon } from "../ui";
import { OnscreenPad, OnscreenButton } from "../ui";
import { default as Engine } from "src/engine/engine";

import { AbstractWindow, Button } from "src/ui/components";
import { Direction } from "../ui/location";
import { Hero, SceneManager, Inventory } from "src/engine";
import World from "src/engine/world";
import { Zone } from "src/engine/objects";
import { Point } from "src/util";
import { MapScene, ZoneScene } from "src/engine/scenes";
import { Yoda } from "src/engine/type";

class MainWindow extends AbstractWindow {
	public static readonly tagName = "wf-main-window";
	private _engine: Engine = null;
	private _handlers = {
		[Engine.Event.AmmoChanged]: () => this._updateAmmo(),
		[Engine.Event.WeaponChanged]: () => this._updateWeapon(),
		[Engine.Event.LocationChanged]: ({ detail }: CustomEvent) => this._updateLocation(detail),
		[Hero.Event.HealthChanged]: () => this._updateHealth(),
		[Inventory.Event.ItemsChanged]: ({ target }: CustomEvent) => this._updateMapButton(target as any),
		[SceneManager.Event.SceneChanged]: ({ target }: CustomEvent) => this._updateMapButton(target as any)
	};
	private cache: Map<string, Element> = new Map();

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
					<Button label="Map" disabled onclick={() => this.toggleMap()}></Button>
					<Button label="Menu"></Button>
				</div>
				<div className="status">
					<Location />
					<div className="equipment">
						<Ammo />
						<Weapon />
					</div>
					<Health />
				</div>
				<div className="controls">
					<OnscreenPad />
					<div className="buttons">
						<OnscreenButton className="drag" label="Drag" />
						<OnscreenButton className="shoot" label="Shoot" />
					</div>
				</div>
				<InventoryComponent />
			</div>
		);
		this.content.querySelector(".controls").addEventListener("touchstart", e => {
			e.preventDefault();
			e.stopImmediatePropagation();
		});
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
			hero.removeEventListener(Hero.Event.HealthChanged, this._handlers[Hero.Event.HealthChanged]);
			hero.removeEventListener(Hero.Event.WeaponChanged, this._handlers[Engine.Event.WeaponChanged]);
			hero.removeEventListener(Hero.Event.AmmoChanged, this._handlers[Engine.Event.AmmoChanged]);

			this._engine.inventory.removeEventListener(
				Inventory.Event.ItemsChanged,
				this._handlers[Inventory.Event.ItemsChanged]
			);
			this._engine.sceneManager.removeEventListener(
				SceneManager.Event.SceneChanged,
				this._handlers[SceneManager.Event.SceneChanged]
			);
		}

		this._engine = e;

		if (this._engine) {
			const hero = this._engine.hero;

			hero.addEventListener(Hero.Event.HealthChanged, this._handlers[Hero.Event.HealthChanged]);
			hero.addEventListener(Hero.Event.WeaponChanged, this._handlers[Engine.Event.WeaponChanged]);
			hero.addEventListener(Hero.Event.AmmoChanged, this._handlers[Engine.Event.AmmoChanged]);

			this._handlers.each((event: any, handler: any) => this._engine.addEventListener(event, handler));
			this._engine.inventory.addEventListener(
				Inventory.Event.ItemsChanged,
				this._handlers[Inventory.Event.ItemsChanged]
			);
			this._engine.sceneManager.addEventListener(
				SceneManager.Event.SceneChanged,
				this._handlers[SceneManager.Event.SceneChanged]
			);
		}

		this.applyCurrentValues();
	}

	disconnectedCallback() {
		this.cache = new Map();
		super.disconnectedCallback();
	}

	private _updateMapButton(source: SceneManager | Inventory) {
		if (source instanceof SceneManager) {
			this.mapButton.active = source.currentScene instanceof MapScene;
		}

		if (source instanceof Inventory) {
			this.mapButton.disabled = !source.contains(Yoda.tileIDs.Locator);
		}
	}

	private get mapButton() {
		return this.querySelector(`${Button.tagName}[label="Map"]`) as Button;
	}

	private toggleMap() {
		if (!this.engine.inventory.contains(Yoda.tileIDs.Locator)) {
			return;
		}

		const currentScene = this.engine.sceneManager.currentScene;

		if (currentScene instanceof MapScene) {
			this.engine.sceneManager.popScene();
			return;
		}

		if (currentScene instanceof ZoneScene) {
			this.engine.sceneManager.pushScene(new MapScene());
			return;
		}
	}

	private toggleInventory(e: Event) {
		const button = e.target as Button;
		button.active = !button.active;

		if (button.active) this.inventory.classList.add("slide-up");
		else this.inventory.classList.remove("slide-up");
	}

	private toggleMenu(e: CustomEvent) {
		const button = e.target as Button;
		button.active = !button.active;
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
		const healthView = this.querySelectorCache(Health.tagName) as Health;
		healthView.health = this._engine.hero.health;
	}

	public get inventory() {
		return this.querySelectorCache(InventoryComponent.tagName) as InventoryComponent;
	}

	public get weapon() {
		return this.querySelectorCache(Weapon.tagName) as Weapon;
	}

	public get ammo() {
		return this.querySelectorCache(Ammo.tagName) as Ammo;
	}

	private get controls() {
		return this.querySelectorCache(".controls");
	}

	private querySelectorCache(sel: string) {
		if (this.cache.has(sel)) return this.cache.get(sel);
		const node = this.querySelector(sel);
		this.cache.set(sel, node);
		return node;
	}
}

export default MainWindow;
