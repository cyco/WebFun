import * as Type from "../../types";
import { Planet } from "../../types";

Number.prototype.isGoalOnPlanet = function (planet) {
	if (planet === Planet.TATOOINE) {
		switch (this) {
			case Type.GOAL_FALCON:
			case Type.GOAL_HAN:
			case Type.GOAL_AMULET:
			case Type.GOAL_ADEGAN_CRYSTAL:
			case Type.GOAL_THREEPIOS_PARTS:
				return true;
			default:
				return false;
		}
	}

	if (planet === Planet.HOTH) {
		switch (this) {
			case Type.GOAL_GENERAL_MARUTZ:
			case Type.GOAL_HIDDEN_FACTORY:
			case Type.GOAL_WARN_THE_REBELS:
			case Type.GOAL_RESCUE_YODA:
			case Type.GOAL_CAR:
				return true;
			default:
				return false;
		}
	}

	if (planet === Planet.ENDOR) {
		switch (this) {
			case Type.GOAL_FIND_LEIA:
			case Type.GOAL_IMPERIAL_BATTLE_STATION:
			case Type.GOAL_LANTERN_OF_SACRED_LIGHT:
			case Type.GOAL_IMPERIAL_BATTLE_CODE:
			case Type.GOAL_RELAY_STATION:
				return true;
			default:
				return false;
		}
	}

	return false;
};
