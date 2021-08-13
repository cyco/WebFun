import {
	Action,
	Character,
	Condition,
	Hotspot,
	Instruction,
	Monster,
	Puzzle,
	Sound,
	Tile,
	Zone
} from "src/engine/objects";

type Ref<To, From, Via = []> = { to: To; from: From; via: Via };

export type Reference =
	| Ref<Character, Character, ["id"]>
	| Ref<Character, Character, ["weapon"]>
	| Ref<Character, Monster, [Zone]>
	| Ref<Hotspot, Hotspot, ["id"]>
	| Ref<Hotspot, Instruction, [Zone, Action, number]>
	| Ref<Hotspot, Zone>
	| Ref<Monster, Condition, [Zone, Action, number]>
	| Ref<Monster, Instruction, [Zone, Action, number]>
	| Ref<Monster, Monster, ["id"]>
	| Ref<Monster, Zone>
	| Ref<Sound, Character>
	| Ref<Sound, Instruction, [Zone, Action, number]>
	| Ref<Sound, Sound, ["id"]>
	| Ref<Tile, Character, [number, number]>
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
