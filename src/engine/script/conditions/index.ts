import Bump from "./bump";
import Condition from "../condition";
import CounterIs from "./counter-is";
import CounterIsNot from "./counter-is-not";
import EndingIs from "./ending-is";
import EnterByPlane from "./enter-by-plane";
import FindItemIs from "./find-item-is";
import GamesWonIs from "./games-won-is";
import GamesWonIsGreaterThan from "./games-won-is-greater-than";
import HasAnyRequiredItem from "./has-any-required-item";
import DropsQuestItemAt from "./drops-quest-item-at";
import HasItem from "./has-item";
import HasNoActiveMonsters from "./has-no-active-monsters";
import HealthIsGreaterThan from "./health-is-greater-than";
import HealthIsLessThan from "./health-is-less-than";
import HeroIsAt from "./hero-is-at";
import IsVariable from "./is-variable";
import ItemPlaced from "./item-placed";
import NoItemPlaced from "./no-item-placed";
import MonsterIsActive from "./monster-is-active";
import PlacedItemIs from "./placed-item-is";
import PlacedItemIsNot from "./placed-item-is-not";
import RandomIs from "./random-is";
import RandomIsGreaterThan from "./random-is-greater-than";
import RandomIsLessThan from "./random-is-less-than";
import RandomIsNot from "./random-is-not";
import RequiredItemIs from "./required-item-is";
import SharedCounterIs from "./shared-counter-is";
import SharedCounterIsGreaterThan from "./shared-counter-is-greater-than";
import SharedCounterIsLessThan from "./shared-counter-is-less-than";
import SharedCounterIsNot from "./shared-counter-is-not";
import StandingOn from "./standing-on";
import TileAtIs from "./tile-at-is";
import Unused from "./unused";
import ZoneEntered from "./zone-entered";
import ZoneIsSolved from "./zone-is-solved";
import ZoneNotInitialized from "./zone-not-initialized";

const ConditionsByName = {
	Bump,
	CounterIs,
	CounterIsNot,
	DropsQuestItemAt,
	EndingIs,
	EnterByPlane,
	FindItemIs,
	GamesWonIs,
	GamesWonIsGreaterThan,
	HasAnyRequiredItem,
	HasItem,
	HasNoActiveMonsters,
	HealthIsGreaterThan,
	HealthIsLessThan,
	HeroIsAt,
	IsVariable,
	ItemPlaced,
	MonsterIsActive,
	NoItemPlaced,
	PlacedItemIs,
	PlacedItemIsNot,
	RandomIs,
	RandomIsGreaterThan,
	RandomIsLessThan,
	RandomIsNot,
	RequiredItemIs,
	SharedCounterIs,
	SharedCounterIsGreaterThan,
	SharedCounterIsLessThan,
	SharedCounterIsNot,
	StandingOn,
	TileAtIs,
	Unused,
	ZoneEntered,
	ZoneIsSolved,
	ZoneNotInitialized
};

const ConditionsByOpcode: Condition[] = new Array(
	Object.values(ConditionsByName)
		.sort((a, b) => b.Opcode - a.Opcode)
		.first().Opcode
);
ConditionsByName.each<Condition>((_, i) => (ConditionsByOpcode[i.Opcode] = i));
const ConditionImplementations = ConditionsByOpcode.map(i => i.Implementation);

export { ConditionsByName, ConditionsByOpcode, ConditionImplementations };
