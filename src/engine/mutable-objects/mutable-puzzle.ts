import { Puzzle, Tile } from "src/engine/objects";

class MutablePuzzle extends Puzzle {
	get id(): number {
		return this._id;
	}

	set id(value: number) {
		this._id = value;
	}

	get item1(): Tile {
		return this._item1;
	}

	set item1(value: Tile) {
		this._item1 = value;
	}

	get item2(): Tile {
		return this._item2;
	}

	set item2(value: Tile) {
		this._item2 = value;
	}

	get strings(): string[] {
		return this._strings;
	}

	set strings(value: string[]) {
		this._strings = value;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get type(): Puzzle.Type {
		return this._type;
	}

	set type(value: Puzzle.Type) {
		this._type = value;
	}

	get item1Class(): Puzzle.ItemClass {
		return this._item1Class;
	}

	set item1Class(value: Puzzle.ItemClass) {
		this._item1Class = value;
	}

	get item2Class(): Puzzle.ItemClass {
		return this._item2Class;
	}

	set item2Class(value: Puzzle.ItemClass) {
		this._item2Class = value;
	}

	get unknown3(): number {
		return this._unknown3;
	}

	set unknown3(value: number) {
		this._unknown3 = value;
	}
}

export default MutablePuzzle;
