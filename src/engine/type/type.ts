import LocatorTile from "../types/locator-tile";

abstract class GameType {
	abstract get saveGameMagic(): string;
	abstract get locatorTile(): LocatorTile;
}

export default GameType;
