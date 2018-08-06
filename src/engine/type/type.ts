import LocatorTile from "../types/locator-tile";

abstract class GameType {
	public readonly name: string;
	abstract get saveGameMagic(): string;
	abstract get locatorTile(): LocatorTile;
}

export default GameType;
