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
import { WorldSize } from "src/engine/generation";
import { rand } from "src/util";
import { MutableZone } from "src/engine/mutable-objects";

class YodaDemo extends Variant {
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
		const goal = engine.assets.get(Puzzle, GoalIDs.HIDDEN_FACTORY);
		engine.assets
			.getFiltered(
				Zone,
				zone =>
					zone.type === Zone.Type.Goal &&
					(!zone.providedItems.includes(goal.item1) || !zone.providedItems.includes(goal.item2))
			)
			.forEach(z => ((z as MutableZone).type = Zone.Type.None));

		return new Story(
			rand(),
			Zone.Planet.Hoth,
			[WorldSize.Small, WorldSize.Medium, WorldSize.Large].random()
		);
	}
}

export default YodaDemo;
