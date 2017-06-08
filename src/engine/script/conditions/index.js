import * as ZoneNotInitialized from "./zone-not-initialized";
import * as ZoneEntered from "./zone-entered";
import * as Bump from "./bump";
import * as PlaceItem from "./place-item";
import * as StandingOn from "./standing-on";
import * as CounterIs from "./counter-is";
import * as RandomIs from "./random-is";
import * as RandomIsGreaterThan from "./random-is-greater-than";
import * as RandomIsLessThan from "./random-is-less-than";
import * as EnterByPlane from "./enter-by-plane";
import * as TileAtIs from "./tile-at-is";
import * as NPCIsActive from "./npc-is-active";
import * as HasNoActiveNPCs from "./has-no-active-npcs";
import * as HasItem from "./has-item";
import * as RequiredItemIs from "./required-item-is";
import * as EndingIs from "./ending-is";
import * as ZoneIsSolved from "./zone-is-solved";
import * as Unknown1 from "./unknown1";
import * as Unknown1Again from "./unknown1-again";
import * as HealthIsLessThan from "./health-is-less-than";
import * as HealthIsGreaterThan from "./health-is-greater-than";
import * as Unknown2 from "./unknown2";
import * as FindItemIs from "./find-item-is";
import * as PlaceItemIsNot from "./place-item-is-not";
import * as HeroIsAt from "./hero-is-at";
import * as PaddingIs from "./padding-is";
import * as PaddingIsLessThan from "./padding-is-less-than";
import * as PaddingIsGreaterThan from "./padding-is-greater-than";
import * as GamesWonIs from "./games-won-is";
import * as HasHotspotTriggerAt from "./has-hotspot-trigger-at";
import * as Unknown5 from "./unknown5";
import * as CounterIsNot from "./counter-is-not";
import * as RandomIsNot from "./random-is-not";
import * as PaddingIsNot from "./padding-is-not";
import * as TileAtIsAgain from "./tile-at-is-again";
import * as GamesWonIsGreaterThan from "./games-won-is-greater-than";

const Conditions = {};
const exportCondition = (C) => Conditions[C.Opcode] = C.default;

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
exportCondition(NPCIsActive);
exportCondition(HasNoActiveNPCs);
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
