import GameType from "../type";
import LocatorTile from "./locator-tile";
import TileID from "./tile-ids";
import { Tile, Char } from "src/engine/objects";
import Strings from "./strings";
import Sounds from "./sounds";

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

	get sounds() {
		return Sounds;
	}

	public canBeEquipped(tile: Tile): boolean {
		return super.canBeEquipped(tile) && tile.id !== TileID.ThermalDetonator;
	}

	public getHealthBonus(tile: Tile): number {
		switch (tile.id) {
			case TileID.QRations:
				return 25;
			case TileID.IceMushroom:
			case TileID.ScrubRoot:
			case TileID.Mushroom:
			case TileID.BactaFluid:
			case TileID.Chakroot:
				return 50;
			case TileID.RebelFirstAidKit:
				return 100;
			case TileID.ImperialFirstAidKit:
				return 100;
			default:
				return null;
		}
	}

	public getMaxAmmo(weapon: Char): number {
		const tile = weapon.frames[0].extensionRight;
		switch (tile.id) {
			case TileID.BlasterRifle:
				return 10;
			case TileID.TheForce:
				return 15;
			case TileID.Blaster:
				return 30;
			case TileID.LightsaberGreen:
			case TileID.LightsaberBlue:
			case TileID.ThermalDetonator:
			default:
				return -1;
		}
	}

	public getEquipSound(weapon: Char): number {
		const tile = weapon.frames[0].extensionRight;
		switch (tile.id) {
			case TileID.BlasterRifle:
			case TileID.Blaster:
				return Sounds.Armed;
			case TileID.LightsaberGreen:
			case TileID.LightsaberBlue:
				return Sounds.SaberOut;
			case TileID.TheForce:
				return Sounds.ArmForce;
			default:
				return -1;
		}
	}
}

export default Yoda;
