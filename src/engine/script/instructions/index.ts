import Instruction from "../instruction";

import AddHealth from "./add-health";
import AddItem from "./add-item";
import AddToCounter from "./add-to-counter";
import AddToSharedCounter from "./add-to-shared-counter";
import ChangeZone from "./change-zone";
import DisableAction from "./disable-action";
import DisableAllNpcs from "./disable-all-npcs";
import DisableHotspot from "./disable-hotspot";
import DisableNpc from "./disable-npc";
import DrawTile from "./draw-tile";
import DropItem from "./drop-item";
import EnableAllNpcs from "./enable-all-npcs";
import EnableHotspot from "./enable-hotspot";
import EnableNpc from "./enable-npc";
import HideHero from "./hide-hero";
import LoseGame from "./lose-game";
import MarkAsSolved from "./mark-as-solved";
import MoveHeroBy from "./move-hero-by";
import MoveTile from "./move-tile";
import PlaceTile from "./place-tile";
import SetVariable from "./set-variable";
import PlaySound from "./play-sound";
import Redraw from "./redraw";
import RemoveItem from "./remove-item";
import RemoveTile from "./remove-tile";
import RollDice from "./roll-dice";
import SetCounter from "./set-counter";
import MoveHeroTo from "./move-hero-to";
import SetSharedCounter from "./set-shared-counter";
import SetRandom from "./set-random";
import SetRectNeedsDisplay from "./set-rect-needs-display";
import SetTileNeedsDisplay from "./set-tile-needs-display";
import ShowHero from "./show-hero";
import SpeakHero from "./speak-hero";
import SpeakNpc from "./speak-npc";
import StopSound from "./stop-sound";
import Wait from "./wait";
import WinGame from "./win-game";

const InstructionsByName = {
	PlaceTile,
	RemoveTile,
	MoveTile,
	DrawTile,
	SpeakHero,
	SpeakNpc,
	EnableNpc,
	DisableNpc,
	EnableAllNpcs,
	DisableAllNpcs,
	SetTileNeedsDisplay,
	SetRectNeedsDisplay,
	Wait,
	Redraw,
	PlaySound,
	StopSound,
	RollDice,
	SetCounter,
	SetVariable,
	HideHero,
	ShowHero,
	MoveHeroTo,
	DisableAction,
	DisableHotspot,
	EnableHotspot,
	DropItem,
	AddItem,
	RemoveItem,
	ChangeZone,
	SetSharedCounter,
	AddToSharedCounter,
	SetRandom,
	AddHealth,
	AddToCounter,
	WinGame,
	LoseGame,
	MarkAsSolved,
	MoveHeroBy
};

const InstructionsByOpcode: Instruction[] = new Array(
	Object.values(InstructionsByName)
		.sort((a, b) => b.Opcode - a.Opcode)
		.first().Opcode
);
InstructionsByName.each<Instruction>((_, i) => (InstructionsByOpcode[i.Opcode] = i));
const InstructionImplementations = InstructionsByOpcode.map(i => i.Implementation);

export { InstructionsByName, InstructionsByOpcode, InstructionImplementations };
