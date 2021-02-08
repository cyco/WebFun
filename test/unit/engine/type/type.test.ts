import { GameType } from "src/engine/type";
import { Tile } from "src/engine/objects";
import { Engine, Story } from "src/engine";

describe("WebFun.Engine.Type", () => {
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

			get name(): string {
				return "mock-type";
			}

			createNewStory(_engine: Engine): Story {
				throw new Error("Method not implemented.");
			}
		})();
		const mockWeapon: Tile = {
			hasAttributes(i: number) {
				return (i & Tile.Attributes.Weapon) === i;
			}
		} as any;
		const mockItem: Tile = {
			hasAttributes(_: number) {
				return false;
			}
		} as any;

		expect(mockType.canBeEquipped(mockWeapon)).toBeTrue();
		expect(mockType.canBeEquipped(mockItem)).toBeFalse();
	});
});
