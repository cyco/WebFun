import Planet from "src/engine/types/planet";
import * as ItemType from "../types";

export default new Map<Planet, Set<number>>([
	[
		Planet.TATOOINE,
		new Set([
			ItemType.GOAL_FALCON,
			ItemType.GOAL_HAN,
			ItemType.GOAL_AMULET,
			ItemType.GOAL_ADEGAN_CRYSTAL,
			ItemType.GOAL_THREEPIOS_PARTS
		])
	],
	[
		Planet.HOTH,
		new Set([
			ItemType.GOAL_GENERAL_MARUTZ,
			ItemType.GOAL_HIDDEN_FACTORY,
			ItemType.GOAL_WARN_THE_REBELS,
			ItemType.GOAL_RESCUE_YODA,
			ItemType.GOAL_CAR
		])
	],
	[
		Planet.ENDOR,
		new Set([
			ItemType.GOAL_FIND_LEIA,
			ItemType.GOAL_IMPERIAL_BATTLE_STATION,
			ItemType.GOAL_LANTERN_OF_SACRED_LIGHT,
			ItemType.GOAL_IMPERIAL_BATTLE_CODE,
			ItemType.GOAL_RELAY_STATION
		])
	]
]);
