import { _Action } from "./action";

export default class Instruction extends _Action {
}

export const Opcode = {
//	PlaceTile: 0x00,
//	RemoveTile: 0x01,
//	MoveTile: 0x02,
//	DrawTile: 0x03,
//	SpeakHero: 0x04,
//	SpeakNPC: 0x05,
//  SetTileNeedsDisplay: 0x06,
//  SetRectNeedsDisplay: 0x07,
//	Wait: 0x08,
//	Redraw: 0x09,
//	PlaySound: 0x0a,
//	StopSound: 0x0b,
// : 0x0b, // unused
//	RollDice: 0x0c,
//	SetCounter: 0x0d,
//	AddToCounter: 0x0e,
//	PlaceTile_Alias_: 0x0f,
//	HideHero: 0x10,
//	ShowHero: 0x11,
//	SetHero: 0x12,
//	MoveHeroBy: 0x13,
//	DisableAction: 0x14,
//	DisableHotspot: 0x15,
//	EnableHotspot: 0x16,
//	EnableNPC: 0x17,
//	DisableNPC: 0x18,
//	EnableAllNPCs: 0x19,
//	DisableAllNPCs: 0x1a,
//	DropItem: 0x1b,
//	AddItem: 0x1c,
	RemoveItem: 0x1d,
	MarkAsSolved: 0x1e,
	WinGame: 0x1f,
	LoseGame: 0x20,
	ChangeZone: 0x21,
	SetPadding: 0x22,
	AddToPadding: 0x23,
	SetRandom: 0x24,
	// AddHealth: 0x25
};
