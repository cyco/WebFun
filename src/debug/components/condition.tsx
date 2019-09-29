import BreakpointButton from "./breakpoint-button";
import BreakpointStore from "../breakpoint-store";
import { Condition } from "src/engine/objects";
import { ConditionsByName as Conditions } from "src/engine/script/conditions";
import Engine from "src/engine/engine";
import InstructionThing from "./instruction-thing";
import LocationBreakpoint from "../breakpoint/location-breakpoint";

class ConditionComponent extends InstructionThing {
	public static readonly tagName = "wf-debug-condition";
	public engine: Engine = null;
	public breakpointStore: BreakpointStore = null;
	private _condition: Condition;

	get condition() {
		return this._condition;
	}

	set condition(condition) {
		this._condition = condition;
		this._rebuild();
	}

	get type() {
		return "c";
	}

	private _rebuild() {
		const name = Object.keys(Conditions).find(
			key => (Conditions as any)[key].Opcode === this._condition.opcode
		);
		const definition = (Conditions as any)[name];

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
						"c",
						this.action.conditions.indexOf(this.condition)
					)
				}
			/>
		);
	}

	private customize(_: any) {
		switch (this._condition.opcode) {
			case Conditions.ZoneNotInitialized.Opcode:
				break;
			case Conditions.ZoneEntered.Opcode:
				break;
			case Conditions.PlacedItemIs.Opcode:
			case Conditions.PlacedItemIsNot.Opcode:
				this.appendLocationArgument(
					this._condition.arguments[0],
					this._condition.arguments[1],
					this._condition.arguments[2]
				);
				this.appendTileArgument(this._condition.arguments[3]);
				this.appendTileArgument(this._condition.arguments[4]);
				break;
			case Conditions.Bump.Opcode:
			case Conditions.StandingOn.Opcode:
				this.appendLocationArgument(this._condition.arguments[0], this._condition.arguments[1]);
				this.appendTileArgument(this._condition.arguments[2]);
				break;
			case Conditions.CounterIs.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.RandomIs.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.RandomIsGreaterThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.RandomIsLessThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.EnterByPlane.Opcode:
				break;
			case Conditions.TileAtIs.Opcode:
				this.appendLocationArgument(
					this._condition.arguments[1],
					this._condition.arguments[2],
					this._condition.arguments[3]
				);
				this.appendTileArgument(this._condition.arguments[0]);
				break;
			case Conditions.NpcIsActive.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.HasNoActiveNpcs.Opcode:
				break;
			case Conditions.HasItem.Opcode:
				this.appendTileArgument(this._condition.arguments[0]);
				break;
			case Conditions.RequiredItemIs.Opcode:
				this.appendTileArgument(this._condition.arguments[0]);
				break;
			case Conditions.EndingIs.Opcode:
				this.appendTileArgument(this._condition.arguments[0]);
				break;
			case Conditions.ZoneIsSolved.Opcode:
				break;
			case Conditions.Unused.Opcode:
				break;
			case Conditions.HealthIsLessThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.HealthIsGreaterThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.FindItemIs.Opcode:
				this.appendTileArgument(this._condition.arguments[0]);
				break;
			case Conditions.HeroIsAt.Opcode:
				this.appendLocationArgument(this._condition.arguments[0], this._condition.arguments[1]);
				break;
			case Conditions.SharedCounterIs.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.SharedCounterIsLessThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.SharedCounterIsGreaterThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.GamesWonIs.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.DropsQuestItemAt.Opcode:
				this.appendLocationArgument(this._condition.arguments[0], this._condition.arguments[1]);
				break;
			case Conditions.HasAnyRequiredItem.Opcode:
				break;
			case Conditions.CounterIsNot.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.RandomIsNot.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.SharedCounterIsNot.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.IsVariable.Opcode:
				const [value, x, y, z] = this._condition.arguments;
				const id = `${x.toString()}x${y.toString()}x${z.toString()}`;

				this.appendChild(
					<span className="argument variable">{this.variableMap[id].toString()}</span>
				);
				this.appendChild(<span className="argument number">{value.toString()}</span>);
				break;
			case Conditions.GamesWonIsGreaterThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
		}
	}
}

export default ConditionComponent;
