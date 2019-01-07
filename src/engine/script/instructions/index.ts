import Instruction from "../instruction";

import AddHealth from "./add-health";
import AddItem from "./add-item";
import AddToCounter from "./add-to-counter";
import AddToPadding from "./add-to-padding";
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
import SetPadding from "./set-padding";
import SetRandom from "./set-random";
import SetRectNeedsDisplay from "./set-rect-needs-display";
import SetTileNeedsDisplay from "./set-tile-needs-display";
import ShowHero from "./show-hero";
import SpeakHero from "./speak-hero";
import SpeakNpc from "./speak-npc";
import StopSound from "./stop-sound";
import Wait from "./wait";
import WinGame from "./win-game";

const InstructionsByName: { [name: string]: Instruction } = {};
const registerInstruction = (name: string, c: Instruction) => (InstructionsByName[name] = c);
registerInstruction("PlaceTile", PlaceTile);
registerInstruction("RemoveTile", RemoveTile);
registerInstruction("MoveTile", MoveTile);
registerInstruction("DrawTile", DrawTile);
registerInstruction("SpeakHero", SpeakHero);
registerInstruction("SpeakNpc", SpeakNpc);
registerInstruction("EnableNpc", EnableNpc);
registerInstruction("DisableNpc", DisableNpc);
registerInstruction("EnableAllNpcs", EnableAllNpcs);
registerInstruction("DisableAllNpcs", DisableAllNpcs);
registerInstruction("SetTileNeedsDisplay", SetTileNeedsDisplay);
registerInstruction("SetRectNeedsDisplay", SetRectNeedsDisplay);
registerInstruction("Wait", Wait);
registerInstruction("Redraw", Redraw);
registerInstruction("PlaySound", PlaySound);
registerInstruction("StopSound", StopSound);
registerInstruction("RollDice", RollDice);
registerInstruction("SetCounter", SetCounter);
registerInstruction("SetVariable", SetVariable);
registerInstruction("HideHero", HideHero);
registerInstruction("ShowHero", ShowHero);
registerInstruction("MoveHeroTo", MoveHeroTo);
registerInstruction("DisableAction", DisableAction);
registerInstruction("DisableHotspot", DisableHotspot);
registerInstruction("EnableHotspot", EnableHotspot);
registerInstruction("DropItem", DropItem);
registerInstruction("AddItem", AddItem);
registerInstruction("RemoveItem", RemoveItem);
registerInstruction("ChangeZone", ChangeZone);
registerInstruction("SetPadding", SetPadding);
registerInstruction("AddToPadding", AddToPadding);
registerInstruction("SetRandom", SetRandom);
registerInstruction("AddHealth", AddHealth);
registerInstruction("AddToCounter", AddToCounter);
registerInstruction("WinGame", WinGame);
registerInstruction("LoseGame", LoseGame);
registerInstruction("MarkAsSolved", MarkAsSolved);
registerInstruction("MoveHeroBy", MoveHeroBy);

const InstructionsByOpcode: Instruction[] = new Array(
	Object.values(InstructionsByName)
		.sort((a, b) => b.Opcode - a.Opcode)
		.first().Opcode
);
InstructionsByName.each<Instruction>((_, i) => (InstructionsByOpcode[i.Opcode] = i));
const InstructionImplementations = InstructionsByOpcode.map(i => i.Implementation);

export { InstructionsByName, InstructionsByOpcode, InstructionImplementations };
