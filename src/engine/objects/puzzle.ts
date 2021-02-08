import PuzzleType from "./puzzle-type";
import Tile from "./tile";
import Zone from "./zone";
import Goals from "./goals";

class Puzzle {
	public static readonly Type = PuzzleType;

	protected _id: number = -1;
	protected _item1: Tile = null;
	protected _item2: Tile = null;
	protected _strings: string[] = ["", "", "", "", ""];
	protected _name: string = "";
	protected _type: PuzzleType = null;
	protected _unknown1: number = null;
	protected _unknown2: number = null;
	protected _unknown3: number = null;

	public isGoalOnPlanet(planet: Zone.Planet): boolean {
		return Goals().get(planet).has(this.id);
	}

	get id(): number {
		return this._id;
	}

	get item1(): Tile {
		return this._item1;
	}

	get item2(): Tile {
		return this._item2;
	}

	get strings(): string[] {
		return this._strings;
	}

	get name(): string {
		return this._name;
	}

	get type(): PuzzleType {
		return this._type;
	}

	get unknown1(): number {
		return this._unknown1;
	}

	get unknown2(): number {
		return this._unknown2;
	}

	get unknown3(): number {
		return this._unknown3;
	}
}

declare namespace Puzzle {
	export type Type = PuzzleType;
}

export default Puzzle;
