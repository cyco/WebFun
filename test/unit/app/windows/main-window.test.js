import MainWindow from "src/app/windows/main-window";
import { Ammo, Health, Inventory, Location, Weapon } from "src/app/ui/components";

describeComponent(MainWindow, () => {
	let subject;
	beforeEach(() => subject = render(MainWindow));

	describe("it contains all the main UI elements", () => {
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
});
