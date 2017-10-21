import * as ItemType from "../types";
import { Planet } from "../types";
import Type, { default as PuzzleType } from "./puzzle-type";

export { Type };

class Puzzle {
	public id: number = -1;
	public readonly item_1 = -1;
	public readonly item_2 = -1;
	public hasPuzzleNPC: boolean = false;
	private _strings: string[] = ["", "", "", "", ""];
	private _name: string = "";
	private _type: PuzzleType = null;
	private _unknown1: any = null;
	private _unknown2: any = null;
	private _unknown3: any = null;

	get type(): PuzzleType {
		return this._type;
	}

	get strings(): string[] {
		return this._strings;
	}

	public isGoalOnPlanet(planet: Planet): boolean {
		const id = this.id;
		if (planet === Planet.TATOOINE) {
			switch (id) {
				case ItemType.GOAL_FALCON:
				case ItemType.GOAL_HAN:
				case ItemType.GOAL_AMULET:
				case ItemType.GOAL_ADEGAN_CRYSTAL:
				case ItemType.GOAL_THREEPIOS_PARTS:
					return true;
				default:
					return false;
			}
		}

		if (planet === Planet.HOTH) {
			switch (id) {
				case ItemType.GOAL_GENERAL_MARUTZ:
				case ItemType.GOAL_HIDDEN_FACTORY:
				case ItemType.GOAL_WARN_THE_REBELS:
				case ItemType.GOAL_RESCUE_YODA:
				case ItemType.GOAL_CAR:
					return true;
				default:
					return false;
			}
		}

		if (planet === Planet.ENDOR) {
			switch (id) {
				case ItemType.GOAL_FIND_LEIA:
				case ItemType.GOAL_IMPERIAL_BATTLE_STATION:
				case ItemType.GOAL_LANTERN_OF_SACRED_LIGHT:
				case ItemType.GOAL_IMPERIAL_BATTLE_CODE:
				case ItemType.GOAL_RELAY_STATION:
					return true;
				default:
					return false;
			}
		}

		return false;
	}
}

export default Puzzle;
