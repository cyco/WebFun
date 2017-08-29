import Action from "./action";
import Hotspot, { Type as HotspotType } from "./hotspot";
import Zone, { Layer as ZoneLayer, Type as ZoneType } from "./zone";
import NPC from "./npc";
import Tile, { Attribute as TileAttribute, Subtype as TileSubtype } from "./tile";

export Char from "./char";
export CharFrame from "./char-frame";
export Condition from "./condition";

export Instruction from "./instruction";
export Puzzle, { Type as PuzzleType } from "./puzzle";

export { Tile, Action, Zone, ZoneType, TileAttribute, ZoneLayer, TileSubtype, Hotspot, HotspotType, NPC };
