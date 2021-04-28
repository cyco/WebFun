import PuzzleType from "./puzzle-type";
import PuzzleItemClass from "./puzzle-item-class";
import Tile from "./tile";

class Puzzle {
	public static readonly Type = PuzzleType;
	public static readonly ItemClass = PuzzleItemClass;

	protected _id: number = -1;
	protected _item1: Tile = null;
	protected _item2: Tile = null;
	protected _strings: string[] = ["", "", "", "", ""];
	protected _name: string = "";
	protected _type: PuzzleType = null;
	protected _unknown3: number = null;
	protected _item1Class: PuzzleItemClass = PuzzleItemClass.None;
	protected _item2Class: PuzzleItemClass = PuzzleItemClass.None;

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

	get unknown3(): number {
		return this._unknown3;
	}

	get item1Class(): PuzzleItemClass {
		return this._item1Class;
	}

	get item2Class(): PuzzleItemClass {
		return this._item2Class;
	}
}

declare namespace Puzzle {
	export type Type = PuzzleType;
	export type ItemClass = PuzzleItemClass;
}

export default Puzzle;
