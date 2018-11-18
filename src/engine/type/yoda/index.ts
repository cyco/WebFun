import GameType from "../type";
import LocatorTile from "./locator-tile";
import TileId from "./tile-ids";
import { Tile, Char } from "src/engine/objects";
import Strings from "./strings";

class Yoda extends GameType {
	get name() {
		return "Yoda Stories";
	}

	get saveGameMagic() {
		return "YODASAV44";
	}

	get locatorTile() {
		return new LocatorTile();
	}

	get strings() {
		return Strings;
	}

	public canBeEquipped(tile: Tile): boolean {
		return super.canBeEquipped(tile) && tile.id !== TileId.ThermalDetonator;
	}

	public getHealthBonus(tile: Tile): number {
		switch (tile.id) {
			case TileId.QRations:
				return 25;
			case TileId.IceMushroom:
			case TileId.ScrubRoot:
			case TileId.Mushroom:
			case TileId.BactaFluid:
			case TileId.Chakroot:
				return 50;
			case TileId.RebelFirstAidKit:
				return 100;
			case TileId.ImperialFirstAidKit:
				return 100;
			default:
				return null;
		}
	}

	public getMaxAmmo(_: Char): number {
		return 0;
	}

	public getEquipSound(_: Char): number {
		return 0;
	}
}

export default Yoda;
