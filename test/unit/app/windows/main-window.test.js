import MainWindow from "src/app/windows/main-window";
import { Ammo, Health, Inventory, Location, Weapon } from "src/app/ui/components";
import { Events as HeroEvents } from "src/engine/hero";
import { Events as EngineEvents } from "src/engine/engine";
import { EventTarget } from "src/util";

describeComponent(MainWindow, () => {
	let subject;

	describe("it contains all the main UI elements", () => {
		beforeAll(() => subject = render(MainWindow));
		it("such as the inventory", () => {
			expect(subject.querySelector(Inventory.TagName)).not.toBeNull();
		});

		it("such as the ammo meter", () => {
			expect(subject.querySelector(Ammo.TagName)).not.toBeNull();
		});

		it("such as the currently equipped weapon", () => {
			expect(subject.querySelector(Weapon.TagName)).not.toBeNull();
		});

		it("such as the location indicator", () => {
			expect(subject.querySelector(Location.TagName)).not.toBeNull();
		});

		it("such as the health meter", () => {
			expect(subject.querySelector(Health.TagName)).not.toBeNull();
		});
	});

	describe("updating components", () => {
		beforeAll(() => subject = render(MainWindow));

		let engine;
		beforeEach(() => {
			engine = mockEngine();
			subject.engine = engine;
		});

		it("registers for hero's health change events", () => {
			engine.triggerHealthChange(200);
			const healthComponent = subject.querySelector(Health.TagName);
			expect(healthComponent.health).toBe(200);
		});

		xit("registers for ammo change events", () => {
			engine.triggerAmmoChange(3);
			const ammo = subject.querySelector(Ammo.TagName);
			expect(ammo.health).toBe(3);
		});

		xit("registers for weapon change events", () => {
			engine.triggerWeaponChange({});
			const weapon = subject.querySelector(Weapon.TagName);
			expect(weapon.weapon).not.toBeNull();
		});

		it("registers for location change events (no world)", () => {
			engine.triggerLocationChange(0);
			const location = subject.querySelector(Location.TagName);
			expect(location.mask).toBe(0);
		});

		it("registers for location change events (can go every where)", () => {
			engine.triggerLocationChange(0xFFFF);
			const location = subject.querySelector(Location.TagName);
			expect(location.mask).toBe(30);
		});
	});

	function mockEngine() {
		class MockHero extends EventTarget {
		}

		const hero = new MockHero();

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
							return mask ? {
								byAdding() {
									return 5;
								}
							} : null;
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
		}

		return new MockEngine();
	}
});
