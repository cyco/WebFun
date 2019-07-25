import { GameType } from "src/engine/type";
import { Tile } from "src/engine/objects";

describe("WebFun.Engine.GameType", () => {
	it("holds information specific to each game", () => {
		expect(GameType).toBeClass();
	});

	it("allow for items to be equipped if they are weapons", () => {
		const mockType = new (class extends GameType {
			saveGameMagic: string;
			locatorTile: any;
			strings: { [_: number]: string };
			sounds: any;
			getHealthBonus(_: any): number {
				throw new Error("Method not implemented.");
			}
			getMaxAmmo(_: any): number {
				throw new Error("Method not implemented.");
			}
			getEquipSound(_: any): number {
				throw new Error("Method not implemented.");
			}
		})();
		const mockWeapon: Tile = {
			isWeapon() {
				return true;
			}
		} as any;
		const mockItem: Tile = {
			isWeapon() {
				return false;
			}
		} as any;

		expect(mockType.canBeEquipped(mockWeapon)).toBeTrue();
		expect(mockType.canBeEquipped(mockItem)).toBeFalse();
	});
});
