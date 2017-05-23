import * as PlaceTile from "./place-tile";
import * as RemoveTile from "./remove-tile";
import * as MoveTile from "./move-tile";
import * as DrawTile from "./draw-tile";
import * as SpeakHero from "./speak-hero";
import * as SpeakNPC from "./speak-npc";
import * as EnableNPC from "./enable-npc";
import * as DisableNPC from "./disable-npc";
import * as EnableAllNPCs from "./enable-all-npcs";
import * as DisableAllNPCs from "./disable-all-npcs";
import * as SetTileNeedsDisplay from "./set-tile-needs-display";
import * as SetRectNeedsDisplay from "./set-rect-needs-display";
import * as Wait from "./wait";
import * as Redraw from "./redraw";
import * as PlaySound from "./play-sound";
import * as StopSound from "./stop-sound";
import * as RollDice from "./roll-dice";
import * as SetCounter from "./set-counter";
import * as PlaceTile_Alias_ from "./place-tile-alias";
import * as HideHero from "./hide-hero";
import * as ShowHero from "./show-hero";
import * as SetHero from "./set-hero";
import * as MoveHeroBy from "./move-hero-by";
import * as DisableAction from "./disable-action";
import * as DisableHotspot from "./disable-hotspot";
import * as EnableHotspot from "./enable-hotspot";
import * as DropItem from "./drop-item";
import * as AddItem from "./add-item";
import * as RemoveItem from "./remove-item";
import * as ChangeZone from "./change-zone";
import * as SetPadding from "./set-padding";
import * as AddToPadding from "./add-to-padding";
import * as SetRandom from "./set-random";
import * as AddHealth from "./add-health";
import * as AddToCounter from "./add-to-counter";
import * as LoseGame from "./lose-game";
import * as WinGame from "./win-game";
import * as MarkAsSolved from "./mark-as-solved";

const Instructions = {};

Instructions[PlaceTile.Opcode] = PlaceTile.default;
Instructions[RemoveTile.Opcode] = RemoveTile.default;
Instructions[MoveTile.Opcode] = MoveTile.default;
Instructions[DrawTile.Opcode] = DrawTile.default;
Instructions[SpeakHero.Opcode] = SpeakHero.default;
Instructions[SpeakNPC.Opcode] = SpeakNPC.default;
Instructions[EnableNPC.Opcode] = EnableNPC.default;
Instructions[DisableNPC.Opcode] = DisableNPC.default;
Instructions[EnableAllNPCs.Opcode] = EnableAllNPCs.default;
Instructions[DisableAllNPCs.Opcode] = DisableAllNPCs.default;
Instructions[SetTileNeedsDisplay.Opcode] = SetTileNeedsDisplay.default;
Instructions[SetRectNeedsDisplay.Opcode] = SetRectNeedsDisplay.default;
Instructions[Wait.Opcode] = Wait.default;
Instructions[Redraw.Opcode] = Redraw.default;
Instructions[PlaySound.Opcode] = PlaySound.default;
Instructions[StopSound.Opcode] = StopSound.default;
Instructions[RollDice.Opcode] = RollDice.default;
Instructions[SetCounter.Opcode] = SetCounter.default;
Instructions[PlaceTile_Alias_.Opcode] = PlaceTile_Alias_.default;
Instructions[HideHero.Opcode] = HideHero.default;
Instructions[ShowHero.Opcode] = ShowHero.default;
Instructions[SetHero.Opcode] = SetHero.default;
Instructions[DisableAction.Opcode] = DisableAction.default;
Instructions[DisableHotspot.Opcode] = DisableHotspot.default;
Instructions[EnableHotspot.Opcode] = EnableHotspot.default;
Instructions[DropItem.Opcode] = DropItem.default;
Instructions[AddItem.Opcode] = AddItem.default;
Instructions[RemoveItem.Opcode] = RemoveItem.default;
Instructions[ChangeZone.Opcode] = ChangeZone.default;
Instructions[SetPadding.Opcode] = SetPadding.default;
Instructions[AddToPadding.Opcode] = AddToPadding.default;
Instructions[SetRandom.Opcode] = SetRandom.default;
Instructions[AddHealth.Opcode] = AddHealth.default;
Instructions[AddToCounter.Opcode] = AddToCounter.default;
Instructions[WinGame.Opcode] = WinGame.default;
Instructions[LoseGame.Opcode] = LoseGame.default;
Instructions[MarkAsSolved.Opcode] = MarkAsSolved.default;
Instructions[MoveHeroBy.Opcode] = MoveHeroBy.default;

export default Instructions;
