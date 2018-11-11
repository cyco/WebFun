import LocatorTile from "../types/locator-tile";

abstract class GameType {
	public readonly name: string;
	abstract get saveGameMagic(): string;
	abstract get locatorTile(): LocatorTile;
	abstract get strings(): { [_: number]: string };
}

export default GameType;
