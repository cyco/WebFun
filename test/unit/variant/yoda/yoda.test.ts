import { Yoda } from "src/variant/yoda";
import Variant from "src/engine/variant";
import TileID from "src/variant/yoda/tile-ids";
import Sounds from "src/variant/yoda/sounds";
import { Tile, Character, Puzzle } from "src/engine/objects";
import { Engine, Story } from "src/engine";
import * as EngineModule from "src/engine";

describe("WebFun.Variant.Yoda", () => {
	let subject: Yoda;
	beforeEach(() => {
		spyOn(EngineModule, "Story").and.returnValues(mockStory());
		subject = new Yoda();
	});
	it("is a class representing a variation of the engine", () => {
		expect(subject).toBeInstanceOf(Variant);
	});

	it("is used to identify a save game's format", () => {
		expect(subject.saveGameMagic).toBe("YODASAV44");
	});

	it("is used to determine which tiles to show in map view", () => {
		expect(subject.locatorTile.here).toEqual(0x345);
	});

	it("provides access to sound ids by name", () => {
		expect(subject.sounds).toHaveMember("Hurt");
	});

	it("determines if an item can be equipped", () => {
		expect(subject.canBeEquipped(mockTile(TileID.TheForce, true))).toBeTrue();
		expect(subject.canBeEquipped(mockTile(TileID.ThermalDetonator, true))).toBeFalse();
		expect(subject.canBeEquipped(mockTile(5))).toBeFalse();
	});

	it("determines the health bonus for items", () => {
		expect(subject.getHealthBonus(mockTile(TileID.QRations))).toEqual(25);
		expect(subject.getHealthBonus(mockTile(TileID.IceMushroom))).toEqual(50);
		expect(subject.getHealthBonus(mockTile(TileID.ScrubRoot))).toEqual(50);
		expect(subject.getHealthBonus(mockTile(TileID.Mushroom))).toEqual(50);
		expect(subject.getHealthBonus(mockTile(TileID.RebelFirstAidKit))).toEqual(100);
		expect(subject.getHealthBonus(mockTile(5))).toEqual(0);
	});

	it("determines the ammo capacity of various weapons", () => {
		expect(subject.getMaxAmmo(mockWeapon(TileID.BlasterRifle))).toEqual(10);
		expect(subject.getMaxAmmo(mockWeapon(TileID.TheForce))).toEqual(15);
		expect(subject.getMaxAmmo(mockWeapon(TileID.Blaster))).toEqual(30);
		expect(subject.getMaxAmmo(mockWeapon(TileID.LightsaberBlue))).toEqual(-1);
		expect(subject.getMaxAmmo(mockWeapon(TileID.LightsaberGreen))).toEqual(-1);
		expect(subject.getMaxAmmo(mockWeapon(5))).toEqual(-1);
	});

	it("determines the sound played when a weapon is equipped", () => {
		expect(subject.getEquipSound(mockWeapon(TileID.BlasterRifle))).toEqual(Sounds.Armed);
		expect(subject.getEquipSound(mockWeapon(TileID.LightsaberGreen))).toEqual(Sounds.SaberOut);
		expect(subject.getEquipSound(mockWeapon(TileID.LightsaberBlue))).toEqual(Sounds.SaberOut);
		expect(subject.getEquipSound(mockWeapon(TileID.TheForce))).toEqual(Sounds.ArmForce);
		expect(subject.getEquipSound(mockWeapon(5))).toEqual(-1);
	});

	it("enables goal 0xbd (yoda missing) if more than 1 game has been won", () => {
		const engineMock = mockEngine();
		engineMock.persistentState.gamesWon = 1;
		const puzzleMock: Puzzle = {} as any;
		spyOn(engineMock.assets, "get").and.returnValue(puzzleMock);

		subject.createNewStory(engineMock);

		expect(puzzleMock.type).toBe(Puzzle.Type.End);
		expect(engineMock.assets.get).toHaveBeenCalledWith(Puzzle, 0xbd);
	});

	it("enables goal 0xc5 if more than 10 games have been won", () => {
		const engineMock = mockEngine();
		engineMock.persistentState.gamesWon = 10;
		const puzzleMock: Puzzle = {} as any;
		spyOn(engineMock.assets, "get").and.returnValue(puzzleMock);

		subject.createNewStory(engineMock);

		expect(puzzleMock.type).toBe(Puzzle.Type.End);
		expect(engineMock.assets.get).toHaveBeenCalledWith(Puzzle, 0xc5);
	});

	function mockStory(): Story {
		return { generate: (): void => void 0 } as any;
	}

	function mockTile(id: number, isWeapon = false): Tile {
		return {
			id,
			hasAttributes: (i: number) => (i & (isWeapon ? Tile.Attributes.Weapon : 0)) === i
		} as any;
	}

	function mockWeapon(id: number): Character {
		return { frames: [{ extensionRight: { id } }] } as any;
	}

	function mockEngine(): Engine {
		return {
			persistentState: {},
			settings: {},
			assets: { get: (): void => void 0, getAll: (): any[] => [], getFiltered: (): any[] => [] }
		} as any;
	}
});
