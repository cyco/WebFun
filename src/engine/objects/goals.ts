import Planet from "src/engine/types/planet";
import { Yoda } from "src/engine/type";

export default (): Map<Planet, Set<number>> =>
	new Map<Planet, Set<number>>([
		[
			Planet.Tatooine,
			new Set([
				Yoda.goalIDs.FALCON,
				Yoda.goalIDs.HAN,
				Yoda.goalIDs.AMULET,
				Yoda.goalIDs.ADEGAN_CRYSTAL,
				Yoda.goalIDs.THREEPIOS_PARTS
			])
		],
		[
			Planet.Hoth,
			new Set([
				Yoda.goalIDs.GENERAL_MARUTZ,
				Yoda.goalIDs.HIDDEN_FACTORY,
				Yoda.goalIDs.WARN_THE_REBELS,
				Yoda.goalIDs.RESCUE_YODA,
				Yoda.goalIDs.CAR
			])
		],
		[
			Planet.Endor,
			new Set([
				Yoda.goalIDs.FIND_LEIA,
				Yoda.goalIDs.IMPERIAL_BATTLE_STATION,
				Yoda.goalIDs.LANTERN_OF_SACRED_LIGHT,
				Yoda.goalIDs.IMPERIAL_BATTLE_CODE,
				Yoda.goalIDs.RELAY_STATION
			])
		]
	]);
