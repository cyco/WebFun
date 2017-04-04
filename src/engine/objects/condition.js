import { _Action } from './action';

export const Opcode = {
	ZoneNotInitalized: 0x00,
	ZoneEntered: 0x01, // Once per zone entered
	Bump: 0x02,
	PlaceItem: 0x03,
	StandingOn: 0x04,
	CounterIs: 0x05,
	RandomIs: 0x06,
	RandomIsGreaterThan: 0x07,
	RandomIsLessThan: 0x08,
	EnterByPlane: 0x09,
	TileAtIs: 0x0a,
	NPCIsActive: 0x0b,
	HasNoActiveNPCs: 0x0c,
	HasItem: 0x0d,
	RequiredItemIs: 0x0e,
	EndingIs: 0x0f,
	ZoneIsSolved: 0x10,
	Unknown1: 0x11,
	Unknown1Again: 0x12,
	HealthIsLessThan: 0x13,
	HealthIsGreaterThan: 0x14,
	Unknown2: 0x15,
	FindItemIs: 0x16,
	PlaceItemIsNot: 0x17,
	HeroIsAt: 0x18,
	PaddingIs: 0x19,
	PaddingIsLessThan: 0x1a,
	PaddingIsGreaterThan: 0x1b,
	GamesWonIs: 0x1c,
	HasHotspotTriggerAt: 0x1d,
	Unknown5: 0x1e,
	CounterIsNot: 0x1f,
	RandomIsNot: 0x20,
	PaddingIsNot: 0x21,
	TileAtIsAgain: 0x22,
	GamesWonIsGreaterThan: 0x23,
};
export default class Condition extends _Action {}
