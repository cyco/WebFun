import InstructionThing from "./instruction-thing";
import { Instruction } from "src/engine/objects";
import Engine from "src/engine/engine";
import { InstructionsByName as Instructions } from "src/engine/script/instructions";
import BreakpointButton from "./breakpoint-button";
import LocationBreakpoint from "../breakpoint/location-breakpoint";
import BreakpointStore from "../breakpoint-store";

class InstructionComponent extends InstructionThing {
	public static readonly tagName = "wf-debug-instruction";
	public engine: Engine;
	private _instruction: Instruction;
	public breakpointStore: BreakpointStore = null;

	get instruction() {
		return this._instruction;
	}

	set instruction(instruction) {
		this._instruction = instruction;
		this._rebuild();
	}

	get type() {
		return "i";
	}

	private _rebuild() {
		const name = Object.keys(Instructions).find(
			key => (Instructions as any)[key].Opcode === this._instruction.opcode
		);
		const definition = (Instructions as any)[name];
		const argCount = Math.max(definition.Arguments, 0);

		this.textContent = "";
		this.appendChild(this._open());
		this.appendChild(this._command(name));
		this.customize(definition);
		this.appendChild(this._close());
		this.appendChild(
			<BreakpointButton
				store={this.breakpointStore}
				breakpoint={
					new LocationBreakpoint(
						this.zone.id,
						this.action.id,
						"i",
						this.action.instructions.indexOf(this.instruction)
					)
				}
			/>
		);
	}

	private customize(_: any) {
		switch (this._instruction.opcode) {
			case Instructions.PlaceTile.Opcode:
				break;
			case Instructions.RemoveTile.Opcode:
				break;
			case Instructions.MoveTile.Opcode:
				break;
			case Instructions.DrawTile.Opcode:
				break;
			case Instructions.SpeakHero.Opcode:
				break;
			case Instructions.SpeakNpc.Opcode:
				break;
			case Instructions.EnableNpc.Opcode:
				break;
			case Instructions.DisableNpc.Opcode:
				break;
			case Instructions.EnableAllNpcs.Opcode:
				break;
			case Instructions.DisableAllNpcs.Opcode:
				break;
			case Instructions.SetTileNeedsDisplay.Opcode:
				break;
			case Instructions.SetRectNeedsDisplay.Opcode:
				break;
			case Instructions.Wait.Opcode:
				break;
			case Instructions.Redraw.Opcode:
				break;
			case Instructions.PlaySound.Opcode:
				break;
			case Instructions.StopSound.Opcode:
				break;
			case Instructions.RollDice.Opcode:
				break;
			case Instructions.SetCounter.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.PlaceTile_Alias_.Opcode:
				break;
			case Instructions.HideHero.Opcode:
				break;
			case Instructions.ShowHero.Opcode:
				break;
			case Instructions.MoveHeroTo.Opcode:
				break;
			case Instructions.DisableAction.Opcode:
				break;
			case Instructions.DisableHotspot.Opcode:
				break;
			case Instructions.EnableHotspot.Opcode:
				break;
			case Instructions.DropItem.Opcode:
				break;
			case Instructions.AddItem.Opcode:
				break;
			case Instructions.RemoveItem.Opcode:
				break;
			case Instructions.ChangeZone.Opcode:
				break;
			case Instructions.SetPadding.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.AddToPadding.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.SetRandom.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.AddHealth.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.AddToCounter.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.WinGame.Opcode:
				break;
			case Instructions.LoseGame.Opcode:
				break;
			case Instructions.MarkAsSolved.Opcode:
				break;
			case Instructions.MoveHeroBy.Opcode:
				break;
		}
	}
}

export default InstructionComponent;
