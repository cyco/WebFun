import {
	Zone,
	Tile,
	Action,
	Instruction,
	Condition,
	Hotspot,
	Monster,
	Sound,
	Char,
	Puzzle
} from "src/engine/objects";

type Ref<To, From, Via = []> = { to: To; from: From; via: Via };

export type Reference =
	| Ref<Char, Char, ["id"]>
	| Ref<Char, Char, ["weapon"]>
	| Ref<Char, Monster, [Zone]>
	| Ref<Hotspot, Hotspot, ["id"]>
	| Ref<Hotspot, Instruction, [Zone, Action, number]>
	| Ref<Hotspot, Zone>
	| Ref<Monster, Condition, [Zone, Action, number]>
	| Ref<Monster, Instruction, [Zone, Action, number]>
	| Ref<Monster, Monster, ["id"]>
	| Ref<Monster, Zone>
	| Ref<Sound, Char>
	| Ref<Sound, Instruction, [Zone, Action, number]>
	| Ref<Sound, Sound, ["id"]>
	| Ref<Tile, Char, [number, number]>
	| Ref<Tile, Condition, [Zone, Action, number]>
	| Ref<Tile, Hotspot, [Zone]>
	| Ref<Tile, Instruction, [Zone, Action, number]>
	| Ref<Tile, Puzzle, ["item1"]>
	| Ref<Tile, Puzzle, ["item2"]>
	| Ref<Tile, Tile, ["id"]>
	| Ref<Tile, Zone, ["goalItems"]>
	| Ref<Tile, Zone, ["npcs"]>
	| Ref<Tile, Zone, ["providedItems"]>
	| Ref<Tile, Zone, ["requiredItems"]>
	| Ref<Tile, Zone, ["tileIDs", number]>
	| Ref<Zone, Hotspot, [Zone]>
	| Ref<Zone, Instruction, [Zone, Action, number]>
	| Ref<Zone, Zone, ["id"]>;
export type Resolvable = Reference["to"];
export type ReferenceTo<T> = Extract<Reference, { to: T }>;
export type ReferencesTo<T> = ReferenceTo<T>[];
