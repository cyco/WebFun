import Condition from "../condition";

import Bump from "./bump";
import CounterIs from "./counter-is";
import CounterIsNot from "./counter-is-not";
import EndingIs from "./ending-is";
import EnterByPlane from "./enter-by-plane";
import FindItemIs from "./find-item-is";
import GamesWonIs from "./games-won-is";
import GamesWonIsGreaterThan from "./games-won-is-greater-than";
import HasHotspotTriggerAt from "./has-hotspot-trigger-at";
import HasItem from "./has-item";
import HasNoActiveNpcs from "./has-no-active-npcs";
import HealthIsGreaterThan from "./health-is-greater-than";
import HealthIsLessThan from "./health-is-less-than";
import HeroIsAt from "./hero-is-at";
import NpcIsActive from "./npc-is-active";
import PaddingIs from "./padding-is";
import PaddingIsGreaterThan from "./padding-is-greater-than";
import PaddingIsLessThan from "./padding-is-less-than";
import PaddingIsNot from "./padding-is-not";
import PlaceItem from "./place-item";
import PlaceItemIsNot from "./place-item-is-not";
import RandomIs from "./random-is";
import RandomIsGreaterThan from "./random-is-greater-than";
import RandomIsLessThan from "./random-is-less-than";
import RandomIsNot from "./random-is-not";
import RequiredItemIs from "./required-item-is";
import StandingOn from "./standing-on";
import TileAtIs from "./tile-at-is";
import TileAtIsAgain from "./tile-at-is-again";
import Unknown1 from "./unknown1";
import Unknown1Again from "./unknown1-again";
import Unknown2 from "./unknown2";
import HasAnyRequiredItem from "./has-any-required-item";
import ZoneEntered from "./zone-entered";
import ZoneIsSolved from "./zone-is-solved";
import ZoneNotInitialized from "./zone-not-initialized";

const ConditionsByName: { [name: string]: Condition } = {};
const registerCondition = (name: string, c: Condition) => (ConditionsByName[name] = c);
registerCondition("ZoneNotInitialized", ZoneNotInitialized);
registerCondition("ZoneEntered", ZoneEntered);
registerCondition("Bump", Bump);
registerCondition("PlaceItem", PlaceItem);
registerCondition("StandingOn", StandingOn);
registerCondition("CounterIs", CounterIs);
registerCondition("RandomIs", RandomIs);
registerCondition("RandomIsGreaterThan", RandomIsGreaterThan);
registerCondition("RandomIsLessThan", RandomIsLessThan);
registerCondition("EnterByPlane", EnterByPlane);
registerCondition("TileAtIs", TileAtIs);
registerCondition("NpcIsActive", NpcIsActive);
registerCondition("HasNoActiveNpcs", HasNoActiveNpcs);
registerCondition("HasItem", HasItem);
registerCondition("RequiredItemIs", RequiredItemIs);
registerCondition("EndingIs", EndingIs);
registerCondition("ZoneIsSolved", ZoneIsSolved);
registerCondition("Unknown1", Unknown1);
registerCondition("Unknown1Again", Unknown1Again);
registerCondition("HealthIsLessThan", HealthIsLessThan);
registerCondition("HealthIsGreaterThan", HealthIsGreaterThan);
registerCondition("Unknown2", Unknown2);
registerCondition("FindItemIs", FindItemIs);
registerCondition("PlaceItemIsNot", PlaceItemIsNot);
registerCondition("HeroIsAt", HeroIsAt);
registerCondition("PaddingIs", PaddingIs);
registerCondition("PaddingIsLessThan", PaddingIsLessThan);
registerCondition("PaddingIsGreaterThan", PaddingIsGreaterThan);
registerCondition("GamesWonIs", GamesWonIs);
registerCondition("HasHotspotTriggerAt", HasHotspotTriggerAt);
registerCondition("HasAnyRequiredItem", HasAnyRequiredItem);
registerCondition("CounterIsNot", CounterIsNot);
registerCondition("RandomIsNot", RandomIsNot);
registerCondition("PaddingIsNot", PaddingIsNot);
registerCondition("TileAtIsAgain", TileAtIsAgain);
registerCondition("GamesWonIsGreaterThan", GamesWonIsGreaterThan);

const ConditionsByOpcode: Condition[] = new Array(
	Object.values(ConditionsByName)
		.sort((a, b) => b.Opcode - a.Opcode)
		.first().Opcode
);
ConditionsByName.each<Condition>((_, c) => (ConditionsByOpcode[c.Opcode] = c));

const ConditionImplementations = ConditionsByOpcode.map(c => c.Implementation);

export { ConditionsByName, ConditionsByOpcode, ConditionImplementations };
