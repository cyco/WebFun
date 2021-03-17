import { Char, Puzzle, Tile, Zone } from "src/engine/objects";

import Variant from "../variant";
import LocatorTile from "./locator-tile";
import Sounds from "./sounds";
import Strings from "./strings";
import Animations from "./animations";
import CharIDs from "./char-ids";
import GoalIDs from "./goal-ids";
import ZoneIDs from "./zone-ids";
import TileIDs from "./tile-ids";
import { Engine, Story } from "src/engine";
import { Point, rand } from "src/util";
import { WorldSize } from "src/engine/generation";
import { MutablePuzzle } from "src/engine/mutable-objects";
import { SaveState } from "src/engine/save-game";
import Settings from "src/settings";

class Yoda extends Variant {
	public static readonly goalIDs = GoalIDs;
	public static readonly zoneIDs = ZoneIDs;
	public static readonly charIDs = CharIDs;
	public static readonly animations = Animations;
	public static readonly tileIDs = TileIDs;

	public readonly name = "Yoda Stories";
	public readonly saveGameMagic = "YODASAV44";
	public readonly locatorTile = new LocatorTile();
	public readonly strings = Strings;
	public readonly sounds = Sounds;
	public readonly goalIDs = GoalIDs;
	public readonly zoneIDs = ZoneIDs;
	public readonly charIDs = CharIDs;
	public readonly animations = Animations;
	public readonly tileIDs = TileIDs;

	public get mapTileId(): number {
		return TileIDs.Locator;
	}

	public get weaponTileId(): number {
		return TileIDs.TheForce;
	}

	public canBeEquipped(tile: Tile): boolean {
		return super.canBeEquipped(tile) && tile.id !== TileIDs.ThermalDetonator;
	}

	public getHealthBonus(tile: Tile): number {
		switch (tile.id) {
			case TileIDs.QRations:
				return 25;
			case TileIDs.IceMushroom:
			case TileIDs.ScrubRoot:
			case TileIDs.Mushroom:
			case TileIDs.BactaFluid:
			case TileIDs.CharkRoot:
				return 50;
			case TileIDs.RebelFirstAidKit:
			case TileIDs.ImperialFirstAidKit:
				return 100;
			default:
				return 0;
		}
	}

	public getMaxAmmo(weapon: Char): number {
		const tile = weapon.frames[0].extensionRight;
		switch (tile.id) {
			case TileIDs.BlasterRifle:
				return 10;
			case TileIDs.TheForce:
				return 15;
			case TileIDs.Blaster:
				return 30;
			case TileIDs.LightsaberGreen:
			case TileIDs.LightsaberBlue:
			case TileIDs.ThermalDetonator:
			default:
				return -1;
		}
	}

	public getEquipSound(weapon: Char): number {
		const tile = weapon.frames[0].extensionRight;
		switch (tile.id) {
			case TileIDs.BlasterRifle:
			case TileIDs.Blaster:
				return Sounds.Armed;
			case TileIDs.LightsaberGreen:
			case TileIDs.LightsaberBlue:
				return Sounds.SaberOut;
			case TileIDs.TheForce:
				return Sounds.ArmForce;
			default:
				return -1;
		}
	}

	public createNewStory(engine: Engine): Story {
		const gamesWon = engine.persistentState.gamesWon;

		if (gamesWon >= 1) {
			const puzzle: MutablePuzzle = engine.assets.get(Puzzle, this.goalIDs.RESCUE_YODA) as any;
			puzzle.type = Puzzle.Type.End;
		}

		if (gamesWon >= 10) {
			const puzzle: MutablePuzzle = engine.assets.get(Puzzle, this.goalIDs.CAR) as any;
			puzzle.type = Puzzle.Type.End;
		}

		return new Story(
			rand(),
			[Zone.Planet.Endor, Zone.Planet.Hoth, Zone.Planet.Tatooine].random(),
			[WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
	}

	public save(engine: Engine): SaveState {
		const state = new SaveState();

		state.type = engine.variant;
		state.seed = engine.story.seed;
		state.planet = engine.story.planet;
		state.puzzleIDs1 = new Int16Array(engine.story.puzzles[0].map(p => p.id));
		state.puzzleIDs2 = new Int16Array(engine.story.puzzles[1].map(p => p.id));
		state.goalPuzzle = engine.story.goal?.id ?? -1;

		state.dagobah = engine.dagobah;
		state.world = engine.world;

		state.onDagobah = engine.currentWorld === engine.dagobah;
		state.positionOnWorld = engine.currentWorld.locationOfSector(engine.currentSector);
		state.currentZoneID = engine.currentZone.id;
		state.positionOnZone = engine.hero.location;

		state.damageTaken = engine.hero.damage;
		state.livesLost = engine.hero.lives;

		state.inventoryIDs = new Int16Array(engine.inventory.items.map(i => i.id));

		state.currentWeapon = engine.hero.weapon?.id ?? -1;
		state.currentAmmo = engine.hero.ammo;

		state.forceAmmo = engine.hero.getAmmoForWeapon(engine.assets.get(Char, CharIDs.TheForce));
		state.blasterAmmo = engine.hero.getAmmoForWeapon(engine.assets.get(Char, CharIDs.Blaster));
		state.blasterRifleAmmo = engine.hero.getAmmoForWeapon(
			engine.assets.get(Char, CharIDs.BlasterRifle)
		);

		state.difficulty = Settings.difficulty;
		state.timeElapsed = engine.totalPlayTime;
		state.worldSize = 0;

		state.unknownCount = 0;
		state.unknownSum = 0;

		return state;
	}

	onPlaceTile(_tile: Tile, _at: Point, _engine: Engine): boolean {
		return false;
	}
}

export default Yoda;
