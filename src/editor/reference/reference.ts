import { Zone, Tile, Action, Instruction, Condition, Hotspot, Monster, Sound, Char, Puzzle } from "src/engine/objects";

type Ref<To, From, Via = []> = { to: To; from: From; via: Via };

export type Reference =
	| Ref<Zone, Instruction, [Zone, Action]>
	| Ref<Zone, Hotspot, [Zone]>
	| Ref<Hotspot, Instruction, [Zone, Action]>
	// lookup not implemented yet:
	| Ref<Sound, Instruction, [Zone, Action]>
	| Ref<Sound, Char>
	| Ref<Monster, Zone>
	| Ref<Monster, Condition, [Zone, Action]>
	| Ref<Monster, Instruction, [Zone, Action]>
	| Ref<Char, Monster>
	| Ref<Char, Char>
	| Ref<Tile, Char>
	| Ref<Tile, Condition, [Zone, Action]>
	| Ref<Tile, Instruction, [Zone, Action]>
	| Ref<Tile, Zone, ["tileIDs"]>
	| Ref<Tile, Zone, ["npcs"]>
	| Ref<Tile, Zone, ["goalItems"]>
	| Ref<Tile, Zone, ["requiredItems"]>
	| Ref<Tile, Zone, ["providedItems"]>
	| Ref<Tile, Puzzle>
	| Ref<Puzzle, Condition, [Zone, Action]>;
export type Resolvable = Reference["to"];
export type ReferenceTo<T> = Extract<Reference, { to: T }>;
export type ReferencesTo<T> = ReferenceTo<T>[];
