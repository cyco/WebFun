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
const exportInstruction = (I) => Instructions[I.Opcode] = I.default;

exportInstruction(PlaceTile);
exportInstruction(RemoveTile);
exportInstruction(MoveTile);
exportInstruction(DrawTile);
exportInstruction(SpeakHero);
exportInstruction(SpeakNPC);
exportInstruction(EnableNPC);
exportInstruction(DisableNPC);
exportInstruction(EnableAllNPCs);
exportInstruction(DisableAllNPCs);
exportInstruction(SetTileNeedsDisplay);
exportInstruction(SetRectNeedsDisplay);
exportInstruction(Wait);
exportInstruction(Redraw);
exportInstruction(PlaySound);
exportInstruction(StopSound);
exportInstruction(RollDice);
exportInstruction(SetCounter);
exportInstruction(PlaceTile_Alias_);
exportInstruction(HideHero);
exportInstruction(ShowHero);
exportInstruction(SetHero);
exportInstruction(DisableAction);
exportInstruction(DisableHotspot);
exportInstruction(EnableHotspot);
exportInstruction(DropItem);
exportInstruction(AddItem);
exportInstruction(RemoveItem);
exportInstruction(ChangeZone);
exportInstruction(SetPadding);
exportInstruction(AddToPadding);
exportInstruction(SetRandom);
exportInstruction(AddHealth);
exportInstruction(AddToCounter);
exportInstruction(WinGame);
exportInstruction(LoseGame);
exportInstruction(MarkAsSolved);
exportInstruction(MoveHeroBy);

export default Instructions;


const Opcode = {};
const exportOpcode = (name, {Opcode: code}) => Opcode[name] = code;
exportOpcode('PlaceTile', PlaceTile);
exportOpcode('RemoveTile', RemoveTile);
exportOpcode('MoveTile', MoveTile);
exportOpcode('DrawTile', DrawTile);
exportOpcode('SpeakHero', SpeakHero);
exportOpcode('SpeakNPC', SpeakNPC);
exportOpcode('EnableNPC', EnableNPC);
exportOpcode('DisableNPC', DisableNPC);
exportOpcode('EnableAllNPCs', EnableAllNPCs);
exportOpcode('DisableAllNPCs', DisableAllNPCs);
exportOpcode('SetTileNeedsDisplay', SetTileNeedsDisplay);
exportOpcode('SetRectNeedsDisplay', SetRectNeedsDisplay);
exportOpcode('Wait', Wait);
exportOpcode('Redraw', Redraw);
exportOpcode('PlaySound', PlaySound);
exportOpcode('StopSound', StopSound);
exportOpcode('RollDice', RollDice);
exportOpcode('SetCounter', SetCounter);
exportOpcode('PlaceTile_Alias_', PlaceTile_Alias_);
exportOpcode('HideHero', HideHero);
exportOpcode('ShowHero', ShowHero);
exportOpcode('SetHero', SetHero);
exportOpcode('DisableAction', DisableAction);
exportOpcode('DisableHotspot', DisableHotspot);
exportOpcode('EnableHotspot', EnableHotspot);
exportOpcode('DropItem', DropItem);
exportOpcode('AddItem', AddItem);
exportOpcode('RemoveItem', RemoveItem);
exportOpcode('ChangeZone', ChangeZone);
exportOpcode('SetPadding', SetPadding);
exportOpcode('AddToPadding', AddToPadding);
exportOpcode('SetRandom', SetRandom);
exportOpcode('AddHealth', AddHealth);
exportOpcode('AddToCounter', AddToCounter);
exportOpcode('WinGame', WinGame);
exportOpcode('LoseGame', LoseGame);
exportOpcode('MarkAsSolved', MarkAsSolved);
exportOpcode('MoveHeroBy', MoveHeroBy);
export { Opcode };

export { PlaceTile }
export { RemoveTile }
export { MoveTile }
export { DrawTile }
export { SpeakHero }
export { SpeakNPC }
export { EnableNPC }
export { DisableNPC }
export { EnableAllNPCs }
export { DisableAllNPCs }
export { SetTileNeedsDisplay }
export { SetRectNeedsDisplay }
export { Wait }
export { Redraw }
export { PlaySound }
export { StopSound }
export { RollDice }
export { SetCounter }
export { PlaceTile_Alias_ }
export { HideHero }
export { ShowHero }
export { SetHero }
export { MoveHeroBy }
export { DisableAction }
export { DisableHotspot }
export { EnableHotspot }
export { DropItem }
export { AddItem }
export { RemoveItem }
export { ChangeZone }
export { SetPadding }
export { AddToPadding }
export { SetRandom }
export { AddHealth }
export { AddToCounter }
export { LoseGame }
export { WinGame }
export { MarkAsSolved }
