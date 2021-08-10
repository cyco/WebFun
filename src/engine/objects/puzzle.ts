import PuzzleType from "./puzzle-type";
import PuzzleItemClass from "./puzzle-item-class";
import Tile from "./tile";
import AssetManager, { NullIfMissing } from "../asset-manager";
import { Puzzle as RawPuzzle } from "src/engine/file-format/types";

class Puzzle {
	public static readonly Type = PuzzleType;
	public static readonly ItemClass = PuzzleItemClass;

	public id: number;
	public item1: Tile;
	public item2: Tile;
	public strings: string[];
	public name: string;
	public type: PuzzleType;
	public unknown3: number;
	public item1Class: PuzzleItemClass;
	public item2Class: PuzzleItemClass;

	public constructor(id: number, data: Puzzle | RawPuzzle, assets: AssetManager = null) {
		this.id = id;
		this.name = data.name ?? "";
		this.unknown3 = data.unknown3;

		if (data instanceof Puzzle) {
			this.type = data.type;
			this.item1 = data.item1;
			this.item2 = data.item2;
			this.strings = data.strings.slice();
			this.item1Class = data.item1Class;
			this.item2Class = data.item2Class;
		} else {
			this.type = PuzzleType.fromNumber(data.type);
			this.item1 = assets.get(Tile, data.item1, NullIfMissing);
			this.item2 = assets.get(Tile, data.item2, NullIfMissing);
			this.strings = data.texts.slice();
			// TODO: Read item class as flags
			this.item1Class = Puzzle.ItemClass.None; // PuzzleItemClass.fromNumber(data.item1Class);
			this.item2Class = Puzzle.ItemClass.None; // PuzzleItemClass.fromNumber(data.item2Class);
		}
	}
}

declare namespace Puzzle {
	export type Type = PuzzleType;
	export type ItemClass = PuzzleItemClass;
}

export default Puzzle;
