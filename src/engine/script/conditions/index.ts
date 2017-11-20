import * as Bump from "./bump";
import * as CounterIs from "./counter-is";
import * as CounterIsNot from "./counter-is-not";
import * as EndingIs from "./ending-is";
import * as EnterByPlane from "./enter-by-plane";
import * as FindItemIs from "./find-item-is";
import * as GamesWonIs from "./games-won-is";
import * as GamesWonIsGreaterThan from "./games-won-is-greater-than";
import * as HasHotspotTriggerAt from "./has-hotspot-trigger-at";
import * as HasItem from "./has-item";
import * as HasNoActiveNpcs from "./has-no-active-npcs";
import * as HealthIsGreaterThan from "./health-is-greater-than";
import * as HealthIsLessThan from "./health-is-less-than";
import * as HeroIsAt from "./hero-is-at";
import * as NpcIsActive from "./npc-is-active";
import * as PaddingIs from "./padding-is";
import * as PaddingIsGreaterThan from "./padding-is-greater-than";
import * as PaddingIsLessThan from "./padding-is-less-than";
import * as PaddingIsNot from "./padding-is-not";
import * as PlaceItem from "./place-item";
import * as PlaceItemIsNot from "./place-item-is-not";
import * as RandomIs from "./random-is";
import * as RandomIsGreaterThan from "./random-is-greater-than";
import * as RandomIsLessThan from "./random-is-less-than";
import * as RandomIsNot from "./random-is-not";
import * as RequiredItemIs from "./required-item-is";
import * as StandingOn from "./standing-on";
import * as TileAtIs from "./tile-at-is";
import * as TileAtIsAgain from "./tile-at-is-again";
import * as Unknown1 from "./unknown1";
import * as Unknown1Again from "./unknown1-again";
import * as Unknown2 from "./unknown2";
import * as Unknown5 from "./unknown5";
import * as ZoneEntered from "./zone-entered";
import * as ZoneIsSolved from "./zone-is-solved";
import * as ZoneNotInitialized from "./zone-not-initialized";

const Conditions = <{[index: string]: Function}>{};
const exportCondition = (C: any) => Conditions[C.Opcode] = C.default;

exportCondition(ZoneNotInitialized);
exportCondition(ZoneEntered);
exportCondition(Bump);
exportCondition(PlaceItem);
exportCondition(StandingOn);
exportCondition(CounterIs);
exportCondition(RandomIs);
exportCondition(RandomIsGreaterThan);
exportCondition(RandomIsLessThan);
exportCondition(EnterByPlane);
exportCondition(TileAtIs);
exportCondition(NpcIsActive);
exportCondition(HasNoActiveNpcs);
exportCondition(HasItem);
exportCondition(RequiredItemIs);
exportCondition(EndingIs);
exportCondition(ZoneIsSolved);
exportCondition(Unknown1);
exportCondition(Unknown1Again);
exportCondition(HealthIsLessThan);
exportCondition(HealthIsGreaterThan);
exportCondition(Unknown2);
exportCondition(FindItemIs);
exportCondition(PlaceItemIsNot);
exportCondition(HeroIsAt);
exportCondition(PaddingIs);
exportCondition(PaddingIsLessThan);
exportCondition(PaddingIsGreaterThan);
exportCondition(GamesWonIs);
exportCondition(HasHotspotTriggerAt);
exportCondition(Unknown5);
exportCondition(CounterIsNot);
exportCondition(RandomIsNot);
exportCondition(PaddingIsNot);
exportCondition(TileAtIsAgain);
exportCondition(GamesWonIsGreaterThan);

export default Conditions;

const Opcode = <{[index: string]: any}>{};
const exportOpcode = (name: string, {Opcode: code}: {Opcode: any}) => Opcode[name] = code;
exportOpcode("ZoneNotInitialized", ZoneNotInitialized);
exportOpcode("ZoneEntered", ZoneEntered);
exportOpcode("Bump", Bump);
exportOpcode("PlaceItem", PlaceItem);
exportOpcode("StandingOn", StandingOn);
exportOpcode("CounterIs", CounterIs);
exportOpcode("RandomIs", RandomIs);
exportOpcode("RandomIsGreaterThan", RandomIsGreaterThan);
exportOpcode("RandomIsLessThan", RandomIsLessThan);
exportOpcode("EnterByPlane", EnterByPlane);
exportOpcode("TileAtIs", TileAtIs);
exportOpcode("NpcIsActive", NpcIsActive);
exportOpcode("HasNoActiveNpcs", HasNoActiveNpcs);
exportOpcode("HasItem", HasItem);
exportOpcode("RequiredItemIs", RequiredItemIs);
exportOpcode("EndingIs", EndingIs);
exportOpcode("ZoneIsSolved", ZoneIsSolved);
exportOpcode("Unknown1", Unknown1);
exportOpcode("Unknown1Again", Unknown1Again);
exportOpcode("HealthIsLessThan", HealthIsLessThan);
exportOpcode("HealthIsGreaterThan", HealthIsGreaterThan);
exportOpcode("Unknown2", Unknown2);
exportOpcode("FindItemIs", FindItemIs);
exportOpcode("PlaceItemIsNot", PlaceItemIsNot);
exportOpcode("HeroIsAt", HeroIsAt);
exportOpcode("PaddingIs", PaddingIs);
exportOpcode("PaddingIsLessThan", PaddingIsLessThan);
exportOpcode("PaddingIsGreaterThan", PaddingIsGreaterThan);
exportOpcode("GamesWonIs", GamesWonIs);
exportOpcode("HasHotspotTriggerAt", HasHotspotTriggerAt);
exportOpcode("Unknown5", Unknown5);
exportOpcode("CounterIsNot", CounterIsNot);
exportOpcode("RandomIsNot", RandomIsNot);
exportOpcode("PaddingIsNot", PaddingIsNot);
exportOpcode("TileAtIsAgain", TileAtIsAgain);
exportOpcode("GamesWonIsGreaterThan", GamesWonIsGreaterThan);
export { Opcode };

export { ZoneNotInitialized };
export { ZoneEntered };
export { Bump };
export { PlaceItem };
export { StandingOn };
export { CounterIs };
export { RandomIs };
export { RandomIsGreaterThan };
export { RandomIsLessThan };
export { EnterByPlane };
export { TileAtIs };
export { NpcIsActive };
export { HasNoActiveNpcs };
export { HasItem };
export { RequiredItemIs };
export { EndingIs };
export { ZoneIsSolved };
export { Unknown1 };
export { Unknown1Again };
export { HealthIsLessThan };
export { HealthIsGreaterThan };
export { Unknown2 };
export { FindItemIs };
export { PlaceItemIsNot };
export { HeroIsAt };
export { PaddingIs };
export { PaddingIsLessThan };
export { PaddingIsGreaterThan };
export { GamesWonIs };
export { HasHotspotTriggerAt };
export { Unknown5 };
export { CounterIsNot };
export { RandomIsNot };
export { PaddingIsNot };
export { TileAtIsAgain };
export { GamesWonIsGreaterThan };
