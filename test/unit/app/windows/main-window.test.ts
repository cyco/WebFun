import { Ammo, Health, Inventory, Location, Weapon } from "src/app/ui";
import MainWindow from "src/app/windows/main-window";
import Engine, { Events as EngineEvents } from "src/engine/engine";
import Hero, { Events as HeroEvents } from "src/engine/hero";
import { EventTarget, Rectangle, Point, Size } from "src/util";
import { Metronome } from "src/engine";
import { Char } from "src/engine/objects";

describeComponent(MainWindow, () => {
	let subject: MainWindow;
	beforeEach(() => (subject = render(MainWindow) as any));

	describe("it contains all the main UI elements", () => {
		it("such as the inventory", () => {
			expect(subject.querySelector(Inventory.tagName)).not.toBeNull();
		});

		it("such as the ammo meter", () => {
			expect(subject.querySelector(Ammo.tagName)).not.toBeNull();
		});

		it("such as the currently equipped weapon", () => {
			expect(subject.querySelector(Weapon.tagName)).not.toBeNull();
		});

		it("such as the location indicator", () => {
			expect(subject.querySelector(Location.tagName)).not.toBeNull();
		});

		it("such as the health meter", () => {
			expect(subject.querySelector(Health.tagName)).not.toBeNull();
		});

		it("shows game view and loading view in the left part", () => {
			expect(subject.mainContent).toBe(subject.content.firstElementChild);
		});

		it("provides access to the inventory component", () => {
			expect(subject.inventory.tagName).toEqual("WF-INVENTORY");
		});

		it("provides access to the weapon component", () => {
			expect(subject.weapon.tagName).toEqual("WF-WEAPON");
		});

		it("provides access to the ammo component", () => {
			expect(subject.ammo.tagName).toEqual("WF-AMMO");
		});
	});

	describe("updating ui", () => {
		let engine: Engine;
		beforeEach(() => {
			engine = mockEngine();
			subject.engine = engine;
		});

		afterEach((): void => (subject.engine = null));

		it("can return the engine", () => {
			expect(subject.engine).toBe(engine);
		});

		it("registers for hero's health change events", () => {
			(engine as any).triggerHealthChange(200);
			const healthComponent: Health = subject.querySelector(Health.tagName) as any;
			expect(healthComponent.health).toBe(200);
		});

		it("registers for location change events (no world)", () => {
			(engine as any).triggerLocationChange(0);
			const location: Location = subject.querySelector(Location.tagName) as any;
			expect(location.mask).toBe(0);
		});

		it("registers for location change events (can go every where)", () => {
			(engine as any).triggerLocationChange(0xffff);
			const location: Location = subject.querySelector(Location.tagName) as any;
			expect(location.mask).toBe(15);
		});

		it("registers for ammo change events", () => {
			const mockWeapon = ({} as any) as Char;
			engine.hero.weapon = mockWeapon;
			engine.hero.ammo = 4;
			(engine as any).triggerAmmoChange();
			expect(subject.ammo.ammo).toEqual(0.4);

			engine.hero.weapon = null;
			engine.hero.ammo = 4;
			(engine as any).triggerAmmoChange();
			expect(subject.ammo.ammo).toEqual(0);
		});

		it("registers for weapon change events", () => {
			const mockWeapon = ({} as any) as Char;
			engine.hero.weapon = mockWeapon;
			(engine as any).triggerWeaponChange();
			expect(subject.weapon.weapon).toEqual(mockWeapon);
		});

		it("stops the engine when closed", () => {
			spyOn(engine.metronome, "stop");

			subject.close();

			expect(engine.metronome.stop).toHaveBeenCalled();
		});
	});

	describe("clearing the engine", () => {
		beforeEach(() => {
			subject.engine = null;
		});

		it("clears all ui elements", () => {
			expect(subject.weapon.weapon).toBeNull();
			expect(subject.ammo.ammo).toBe(0);
		});
	});

	function mockEngine(): Engine {
		class MockHero extends EventTarget {}

		const hero: Hero = new MockHero() as any;
		const metronome: Metronome = { stop() {} } as any;

		class MockEngine extends EventTarget {
			type = { getMaxAmmo: () => 10 };

			triggerHealthChange(value: number) {
				hero.health = value;
				hero.dispatchEvent(HeroEvents.HealthChanged);
			}

			triggerAmmoChange() {
				this.dispatchEvent(EngineEvents.AmmoChanged);
			}

			triggerWeaponChange() {
				this.dispatchEvent(EngineEvents.WeaponChanged);
			}

			triggerLocationChange(mask: number) {
				const detail = {
					world: {
						findLocationOfZone() {
							return mask
								? {
										byAdding() {
											return new Point(1, 1);
										}
								  }
								: null;
						},
						bounds: new Rectangle(new Point(0, 0), new Size(10, 10)),

						at() {
							return { zone: {} } as any;
						}
					}
				};
				this.dispatchEvent(EngineEvents.LocationChanged, detail);
			}

			get hero() {
				return hero;
			}

			get metronome() {
				return metronome;
			}
		}

		return new MockEngine() as any;
	}
});
