import Type from "./puzzle-type";

export { Type };

class Puzzle {
	private _strings: string[] = ["", "", "", "", ""];
	public id: number = -1;
	private _name: string = "";
	private _type: number = -1;
	private _unknown1: any = null;
	private _unknown2: any = null;
	private _unknown3: any = null;
	public readonly item_1 = -1;
	public readonly item_2 = -1;
	public hasPuzzleNPC: boolean = false;

	get type(): number {
		return this._type;
	}

	get strings(): string[] {
		return this._strings;
	}
}

export default Puzzle;
