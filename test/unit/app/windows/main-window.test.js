import { Ammo, Health, Inventory, Location, Weapon } from "src/app/ui";
import MainWindow from "src/app/windows/main-window";
import { Events as EngineEvents } from "src/engine/engine";
import { Events as HeroEvents } from "src/engine/hero";
import { EventTarget } from "src/util";

describeComponent(MainWindow, () => {
	let subject;

	describe("it contains all the main UI elements", () => {
		beforeAll(() => (subject = render(MainWindow)));

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
		beforeAll(() => (subject = render(MainWindow)));

		let engine;
		beforeEach(() => {
			engine = mockEngine();
			subject.engine = engine;
		});

		afterEach(() => (subject.engine = null));

		it("can return the engine", () => {
			expect(subject.engine).toBe(engine);
		});

		it("registers for hero's health change events", () => {
			engine.triggerHealthChange(200);
			const healthComponent = subject.querySelector(Health.tagName);
			expect(healthComponent.health).toBe(200);
		});

		it("registers for location change events (no world)", () => {
			engine.triggerLocationChange(0);
			const location = subject.querySelector(Location.tagName);
			expect(location.mask).toBe(0);
		});

		it("registers for location change events (can go every where)", () => {
			engine.triggerLocationChange(0xffff);
			const location = subject.querySelector(Location.tagName);
			expect(location.mask).toBe(15);
		});

		it("stops the engine when closed", () => {
			spyOn(engine.metronome, "stop");

			subject.close();

			expect(engine.metronome.stop).toHaveBeenCalled();
		});
	});

	function mockEngine() {
		class MockHero extends EventTarget {}

		const hero = new MockHero();
		const metronome = { stop() {} };

		class MockEngine extends EventTarget {
			triggerHealthChange(value) {
				hero.health = value;
				hero.dispatchEvent(HeroEvents.HealthChanged);
			}

			triggerAmmoChange(value) {
				this.dispatchEvent(EngineEvents.AmmoChanged);
			}

			triggerWeaponChange(value) {
				this.dispatchEvent(EngineEvents.WeaponChanged);
			}

			triggerLocationChange(mask) {
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

		return new MockEngine();
	}
});
