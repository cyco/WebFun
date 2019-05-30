import { GameType } from "src/engine/type";

describe("WebFun.Engine.GameType", () => {
	it("holds information specific to each game", () => {
		expect(GameType).toBeClass();
	});

	it("allow for items to be equipped if they are weapons", () => {
		const mockType = new (class extends GameType {})();
		const mockWeapon = {
			isWeapon() {
				return true;
			}
		};
		const mockItem = {
			isWeapon() {
				return false;
			}
		};

		expect(mockType.canBeEquipped(mockWeapon)).toBeTrue();
		expect(mockType.canBeEquipped(mockItem)).toBeFalse();
	});
});
