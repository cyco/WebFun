import LocatorTile from "./locator-tile";
import Sounds from "./sounds";
import CharIDs from "./char-ids";
import GoalIDs from "./goal-ids";
import ZoneIDs from "./zone-ids";
import TileIDs from "./tile-ids";
import Variant from "src/engine/variant";
import { Char, Puzzle, Tile, Zone } from "src/engine/objects";
import { Engine, Story } from "src/engine";
import { Point, rand, Size } from "src/util";
import { WorldSize } from "src/engine/generation";
import { MutablePuzzle } from "src/engine/mutable-objects";
import { SaveState } from "src/engine/save-game";
import { Sprite } from "src/engine/rendering";

import DetonatorScene from "./detonator-scene";
import { ZoneScene } from "src/engine/scenes";
import { NullIfMissing } from "src/engine/asset-manager";
import { ColorCycle } from "src/engine/rendering/palette-animation";

class Yoda extends Variant {
	public slowColorCycles: ColorCycle[] = [
		/* [start , color count ] */
		[0xc6, 2],
		[0xc8, 2],
		[0xd7, 9],
		[0xe5, 9],
		[0xf4, 2]
	];
	public fastColorCycles: ColorCycle[] = [
		/* [start , color count ] */
		[0x0a, 6],
		[0xca, 2],
		[0xcc, 2],
		[0xce, 2],
		[0xe0, 5],
		[0xee, 6]
	];
	public static readonly goalIDs = GoalIDs;
	public static readonly zoneIDs = ZoneIDs;
	public static readonly charIDs = CharIDs;
	public static readonly tileIDs = TileIDs;

	public readonly saveGameMagic = "YODASAV44";
	public readonly mapKey = "KeyL";
	public readonly locatorTile = new LocatorTile();
	public readonly sounds = Sounds;
	public readonly goalIDs = GoalIDs;
	public readonly zoneIDs = ZoneIDs;
	public readonly charIDs = CharIDs;
	public readonly tileIDs = TileIDs;
	public readonly mapTileId = TileIDs.Locator;
	public readonly weaponTileId = TileIDs.TheForce;

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
		if (!weapon) return -1;
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
		const size = engine.settings.worldSize;
		const lastPlanet = engine.settings.lastPlanet;

		if (gamesWon >= 1) {
			const puzzle: MutablePuzzle = engine.assets.get(Puzzle, this.goalIDs.RESCUE_YODA) as any;
			puzzle.type = Puzzle.Type.End;
		}

		if (gamesWon >= 10) {
			const puzzle: MutablePuzzle = engine.assets.get(Puzzle, this.goalIDs.CAR) as any;
			puzzle.type = Puzzle.Type.End;
		}
		const planets = [Zone.Planet.Endor, Zone.Planet.Hoth, Zone.Planet.Tatooine];
		if (lastPlanet && Zone.Planet.isPlanet(lastPlanet)) {
			planets.remove(Zone.Planet.fromNumber(lastPlanet));
		}

		const story = new Story(engine.assets, engine.variant);
		story.generate(
			rand(),
			planets.random(),
			WorldSize.isWorldSize(size)
				? WorldSize.fromNumber(size)
				: [WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
		return story;
	}

	public save(engine: Engine): SaveState {
		const state = new SaveState();

		state.type = engine.variant;
		state.seed = engine.story.seed;
		state.planet = engine.story.planet;
		state.puzzleIDs1 = engine.story.puzzles[0].map(p => p.id);
		state.puzzleIDs2 = engine.story.puzzles[1].map(p => p.id);
		state.goalPuzzle = engine.story.goal?.id ?? -1;

		//state.dagobah = engine.dagobah;
		//state.world = engine.world;

		state.onDagobah = engine.currentWorld === engine.dagobah;
		state.positionOnWorld = engine.currentWorld.locationOfSector(engine.currentSector);
		state.currentZoneID = engine.currentZone.id;
		state.positionOnZone = engine.hero.location;

		state.damageTaken = engine.hero.damage;
		state.livesLost = engine.hero.lives;

		state.inventoryIDs = engine.inventory.items.map(i => i.id);

		state.currentWeapon = engine.hero.weapon?.id ?? -1;
		state.currentAmmo = engine.hero.ammo;

		state.forceAmmo = engine.hero.getAmmoForWeapon(engine.assets.get(Char, CharIDs.TheForce));
		state.blasterAmmo = engine.hero.getAmmoForWeapon(engine.assets.get(Char, CharIDs.Blaster));
		state.blasterRifleAmmo = engine.hero.getAmmoForWeapon(
			engine.assets.get(Char, CharIDs.BlasterRifle)
		);

		state.difficulty = engine.settings.difficulty;
		state.timeElapsed = engine.totalPlayTime;
		state.worldSize = 0;

		state.unknownCount = 0;
		state.unknownSum = 0;

		return state;
	}

	onPlaceTile(tile: Tile, at: Point, engine: Engine): boolean {
		if (tile.id === TileIDs.ThermalDetonator) {
			const scene = new DetonatorScene();
			scene.detonatorLocation = at;

			engine.inventory.removeItem(TileIDs.ThermalDetonator);
			engine.inputManager.clear();
			engine.inputManager.placedTile = null;
			engine.inputManager.placedTileLocation = null;
			engine.sceneManager.pushScene(scene);

			return true;
		}

		if (tile.id === TileIDs.R2D2) {
			const sprite = new Sprite(
				new Point(at.x, at.y, 2),
				new Size(Tile.WIDTH, Tile.HEIGHT),
				tile.imageData
			);
			const scene = engine.sceneManager.currentScene as ZoneScene;
			scene.sprites.push(sprite);
			const textId = this.findDescription(at, engine);
			const text = engine.assets.get(String, textId).toString();
			engine.speak(text, at).then(() => {
				const index = scene.sprites.indexOf(sprite);
				scene.sprites.splice(index, 1);
			});

			return true;
		}

		return false;
	}

	findDescription(at: Point, engine: Engine): number {
		enum StringIDs {
			AboutWalking = 57383,
			AboutFinding = 57384,
			AboutUsing = 57385,
			AboutWeapons = 57386,
			AboutHealth = 57387,

			Yoda = 57382,
			Hero = 57395,
			Vader = 57388,
			MedicalDroid = 57398,

			TeleporterActive = 57396,
			TeleporterInactive = 57397,

			Draggable = 57380,
			Weapon = 57400,
			Enemy = 57378,
			NPC = 57381,

			Ewok = 57391,
			Jawa = 57392,
			Droid = 57393,

			xWing = 57377,
			Storage = 57376,
			Door = 57379,

			Win = 37389,
			Lose = 57390
		}
		const storageIDs = [0x102, 0x10, 0x48d, 0x279, 0x27b, 0x27c, 0x6e5];
		const doorIDs = [
			70, 71, 72, 73, 74, 75, 76, 145, 149, 152, 153, 220, 221, 223, 231, 232, 233, 350, 582, 584,
			586, 588, 702, 709, 755, 756, 759, 760, 804, 806, 983, 984, 1047, 1048, 1081, 1112, 1120,
			1259, 1461, 1462, 1472, 1473, 1539, 1544, 1858
		];

		if (at.isEqualTo(engine.hero.location)) return StringIDs.Hero;
		for (const v of Object.keys(StringIDs)) {
			if (typeof v !== "number") continue;
			const str = engine.assets.get(String, v, NullIfMissing);
			if (!str) console.warn("String ", v, StringIDs[v], "does not exist!");
		}

		const currentZone = engine.currentZone;

		const tile = currentZone.getTile(at.x, at.y, 1) ?? currentZone.getTile(at.x, at.y, 0);

		const monster = currentZone.monsters.find(({ x, y }) => at.isEqualTo({ x, y, z: null }));
		if (monster && monster.face && monster.alive) {
			const charID = monster.face.id;
			if (charID === CharIDs.Vader) return StringIDs.Vader;

			if (charID === CharIDs.Blank) return StringIDs.Jawa;
			if (charID === CharIDs.Jawa) return StringIDs.Jawa;
			if (charID === CharIDs.MadJawa) return StringIDs.Jawa;

			if (charID === CharIDs.Ewok) return StringIDs.Ewok;

			if (charID === CharIDs.R2Unit) return StringIDs.Droid;
		}

		if (tile.id === TileIDs.Yoda) {
			return StringIDs.Yoda;
		}

		if (tile.id === TileIDs.MedicalDroid) {
			return StringIDs.MedicalDroid;
		}

		if (tile.id === TileIDs.TeleporterInactive) {
			return StringIDs.TeleporterInactive;
		}

		if (tile.id === TileIDs.TeleporterActive) {
			return StringIDs.TeleporterActive;
		}

		if (tile.id === TileIDs.XWingPart1) {
			return StringIDs.xWing;
		}

		if (tile.id === TileIDs.XWingPart2) {
			return StringIDs.xWing;
		}

		if (tile.id === TileIDs.XWingPart3) {
			return StringIDs.xWing;
		}

		if (storageIDs.includes(tile.id)) {
			return StringIDs.Storage;
		}

		if (doorIDs.includes(tile.id)) {
			return StringIDs.Door;
		}

		if (tile.hasAttributes(Tile.Attributes.Draggable)) {
			return StringIDs.Draggable;
		}

		if (tile.hasAttributes(Tile.Attributes.Weapon)) {
			return StringIDs.Weapon;
		}

		if (tile.hasAttributes(Tile.Attributes.Enemy)) {
			return StringIDs.Enemy;
		}

		if (tile.hasAttributes(Tile.Attributes.NPC)) {
			return StringIDs.NPC;
		}

		return [
			StringIDs.AboutWalking,
			StringIDs.AboutUsing,
			StringIDs.AboutFinding,
			StringIDs.AboutWeapons,
			StringIDs.AboutHealth
		].random();
	}
}

export default Yoda;
