import * as ItemType from "../types";
import { Planet } from "../types";
import Type, { default as PuzzleType } from "./puzzle-type";
import Tile from "./tile";

export { Type };

class Puzzle {
	protected _id: number = -1;
	protected _item1: Tile;
	protected _item2: Tile;
	protected _strings: string[] = ["", "", "", "", ""];
	protected _name: string = "";
	protected _type: PuzzleType = null;
	protected _unknown1: number = null;
	protected _unknown2: number = null;
	protected _unknown3: number = null;

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


	get id() {
		return this._id;
	}

	get item1() {
		return this._item1;
	}

	get item2() {
		return this._item2;
	}

	get strings() {
		return this._strings;
	}

	get name() {
		return this._name;
	}

	get type() {
		return this._type;
	}

	get unknown1() {
		return this._unknown1;
	}

	get unknown2() {
		return this._unknown2;
	}

	get unknown3() {
		return this._unknown3;
	}
}

export default Puzzle;
