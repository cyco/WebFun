import { Ammo, Health, Inventory, Location, Weapon } from "src/app/ui";
import MainWindow from "src/app/windows/main-window";
import Engine, { Events as EngineEvents } from "src/engine/engine";
import Hero, { Events as HeroEvents } from "src/engine/hero";
import { EventTarget } from "src/util";
import { Metronome } from "src/engine";

describeComponent(MainWindow, () => {
	let subject: MainWindow;

	describe("it contains all the main UI elements", () => {
		beforeAll(() => (subject = render(MainWindow) as any));

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
	});

	describe("updating ui", () => {
		beforeAll(() => (subject = render(MainWindow) as any));

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
			spyOn(subject as any, "_updateAmmo");
			(engine as any).triggerAmmoChange();
			expect((subject as any)._updateAmmo).toHaveBeenCalled();
		});

		it("registers for weapon change events", () => {
			spyOn(subject as any, "_updateWeapon");
			(engine as any).triggerWeaponChange();
			expect((subject as any)._updateWeapon).toHaveBeenCalled();
		});

		it("stops the engine when closed", () => {
			spyOn(engine.metronome, "stop");

			subject.close();

			expect(engine.metronome.stop).toHaveBeenCalled();
		});
	});

	function mockEngine(): Engine {
		class MockHero extends EventTarget {}

		const hero: Hero = new MockHero() as any;
		const metronome: Metronome = { stop() {} } as any;

		class MockEngine extends EventTarget {
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
						locationOfZone() {
							return mask
								? {
										byAdding() {
											return 5;
										}
								  }
								: null;
						},
						getZone() {
							return {};
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
