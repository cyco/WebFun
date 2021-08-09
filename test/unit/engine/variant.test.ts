import Variant from "src/engine/variant";
import { Tile } from "src/engine/objects";
import { Engine, SaveState, Story } from "src/engine";
import { Point } from "src/util";
import { ColorCycle } from "src/engine/rendering/palette-animation";

describe("WebFun.Engine.Variant", () => {
	it("holds information specific to each game", () => {
		expect(Variant).toBeClass();
	});

	it("allow for items to be equipped if they are weapons", () => {
		const mockType = new (class extends Variant {
			slowColorCycles: ColorCycle[] = [];
			fastColorCycles: ColorCycle[] = [];
			mapKey = "KeyM";
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
			takeSnapshot(_: Engine): SaveState {
				throw new Error("Method not implemented.");
			}

			get mapTileId(): number {
				throw new Error("Method not implemented.");
			}

			get weaponTileId(): number {
				throw new Error("Method not implemented.");
			}

			createNewStory(_: Engine): Story {
				throw new Error("Method not implemented.");
			}

			onPlaceTile(_tile: Tile, _at: Point, _engine: Engine): boolean {
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
