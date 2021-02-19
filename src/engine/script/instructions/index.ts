import Instruction from "../instruction";

import AddHealth from "./add-health";
import AddItem from "./add-item";
import AddToCounter from "./add-to-counter";
import AddToSectorCounter from "./add-to-sector-counter";
import ChangeZone from "./change-zone";
import DisableAction from "./disable-action";
import DisableAllMonsters from "./disable-all-monsters";
import DisableHotspot from "./disable-hotspot";
import DisableMonster from "./disable-monster";
import DrawTile from "./draw-tile";
import DropItem from "./drop-item";
import EnableAllMonsters from "./enable-all-monsters";
import EnableHotspot from "./enable-hotspot";
import EnableMonster from "./enable-monster";
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
import SetSectorCounter from "./set-sector-counter";
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
	AddHealth,
	AddItem,
	AddToCounter,
	AddToSectorCounter,
	ChangeZone,
	DisableAction,
	DisableAllMonsters,
	DisableHotspot,
	DisableMonster,
	DrawTile,
	DropItem,
	EnableAllMonsters,
	EnableHotspot,
	EnableMonster,
	HideHero,
	LoseGame,
	MarkAsSolved,
	MoveHeroBy,
	MoveHeroTo,
	MoveTile,
	PlaceTile,
	PlaySound,
	Redraw,
	RemoveItem,
	RemoveTile,
	RollDice,
	SetCounter,
	SetRandom,
	SetRectNeedsDisplay,
	SetSectorCounter,
	SetTileNeedsDisplay,
	SetVariable,
	ShowHero,
	SpeakHero,
	SpeakNpc,
	StopSound,
	Wait,
	WinGame
};

const InstructionsByOpcode: Instruction[] = new Array(
	Object.values(InstructionsByName)
		.sort((a, b) => b.Opcode - a.Opcode)
		.first().Opcode
);
InstructionsByName.each<Instruction>((_, i) => (InstructionsByOpcode[i.Opcode] = i));
const InstructionImplementations = InstructionsByOpcode.map(i => i.Implementation);

export { InstructionsByName, InstructionsByOpcode, InstructionImplementations };
