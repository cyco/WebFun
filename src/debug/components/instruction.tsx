import BreakpointButton from "./breakpoint-button";
import BreakpointStore from "../breakpoint-store";
import Engine from "src/engine/engine";
import { Instruction, Sound } from "src/engine/objects";
import InstructionThing from "./instruction-thing";
import { InstructionsByName as Instructions } from "src/engine/script/instructions";
import LocationBreakpoint from "../breakpoint/location-breakpoint";

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
				this.appendLocationArgument(
					this._instruction.arguments[0],
					this._instruction.arguments[1],
					this._instruction.arguments[2]
				);
				this.appendTileArgument(this._instruction.arguments[3]);
				break;
			case Instructions.RemoveTile.Opcode:
				this.appendLocationArgument(
					this._instruction.arguments[0],
					this._instruction.arguments[1],
					this._instruction.arguments[2]
				);
				break;
			case Instructions.MoveTile.Opcode:
				this.appendLocationArgument(
					this._instruction.arguments[0],
					this._instruction.arguments[1],
					this._instruction.arguments[2]
				);
				this.appendLocationArgument(
					this._instruction.arguments[3],
					this._instruction.arguments[4],
					this._instruction.arguments[2]
				);
				break;
			case Instructions.DrawTile.Opcode:
				this.appendLocationArgument(
					this._instruction.arguments[3],
					this._instruction.arguments[4],
					this._instruction.arguments[2]
				);
				break;
			case Instructions.SpeakHero.Opcode:
				this.appendTextArgument(this._instruction.text);
				break;
			case Instructions.SpeakNpc.Opcode:
				this.appendLocationArgument(this._instruction.arguments[0], this._instruction.arguments[1]);
				this.appendTextArgument(this._instruction.text);
				break;
			case Instructions.EnableNpc.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.DisableNpc.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
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
				this.appendSoundArgument(this._instruction.arguments[0]);
				break;
			case Instructions.StopSound.Opcode:
				break;
			case Instructions.RollDice.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.SetCounter.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.SetVariable.Opcode:
				const [x, y, z, value] = this._instruction.arguments;
				const id = `${x.toString()}x${y.toString()}x${z.toString()}`;

				this.appendChild(
					<span className="argument variable">{this.variableMap[id].toString()}</span>
				);
				this.appendChild(<span className="argument number">{value.toString()}</span>);

				break;
			case Instructions.HideHero.Opcode:
				break;
			case Instructions.ShowHero.Opcode:
				break;
			case Instructions.MoveHeroTo.Opcode:
				this.appendLocationArgument(this._instruction.arguments[0], this._instruction.arguments[1]);
				break;
			case Instructions.DisableAction.Opcode:
				break;
			case Instructions.DisableHotspot.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.EnableHotspot.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.DropItem.Opcode:
				this.appendTileArgument(this._instruction.arguments[0]);
				this.appendLocationArgument(this._instruction.arguments[1], this._instruction.arguments[2]);
				break;
			case Instructions.AddItem.Opcode:
				this.appendTileArgument(this._instruction.arguments[0]);
				break;
			case Instructions.RemoveItem.Opcode:
				this.appendTileArgument(this._instruction.arguments[0]);
				break;
			case Instructions.ChangeZone.Opcode:
				break;
			case Instructions.SetSharedCounter.Opcode:
				this.appendNumberArgument(this._instruction.arguments[0]);
				break;
			case Instructions.AddToSharedCounter.Opcode:
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
				this.appendLocationArgument(this._instruction.arguments[0], this._instruction.arguments[1]);
				break;
		}
	}

	protected appendTextArgument(text: string) {
		this.appendChild(
			<span className="argument text" title={text}>
				text
			</span>
		);
	}

	protected appendSoundArgument(sound: number) {
		this.appendChild(
			<span className="argument sound">{this.engine.assetManager.get(Sound, sound).file}</span>
		);
	}
}

export default InstructionComponent;
