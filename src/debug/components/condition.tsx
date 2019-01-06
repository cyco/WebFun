import { ConditionsByName as Conditions } from "src/engine/script/conditions";
import InstructionThing from "./instruction-thing";
import Condition from "src/engine/objects/condition";
import Engine from "src/engine/engine";
import BreakpointButton from "./breakpoint-button";
import LocationBreakpoint from "../breakpoint/location-breakpoint";
import BreakpointStore from "../breakpoint-store";

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
			case Conditions.Bump.Opcode:
				this.appendLocationArgument(this._condition.arguments[0], this._condition.arguments[1]);
				this.appendTileArgument(this._condition.arguments[2]);
				break;
			case Conditions.PlaceItem.Opcode:
				this.appendLocationArgument(
					this._condition.arguments[0],
					this._condition.arguments[1],
					this._condition.arguments[2]
				);
				this.appendTileArgument(this._condition.arguments[3]);
				this.appendTileArgument(this._condition.arguments[4]);
				break;
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
				break;
			case Conditions.ZoneIsSolved.Opcode:
				break;
			case Conditions.Unknown1.Opcode:
				break;
			case Conditions.GameWon.Opcode:
				break;
			case Conditions.HealthIsLessThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.HealthIsGreaterThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.Unknown2.Opcode:
				break;
			case Conditions.FindItemIs.Opcode:
				this.appendTileArgument(this._condition.arguments[0]);
				break;
			case Conditions.PlaceItemIsNot.Opcode:
				break;
			case Conditions.HeroIsAt.Opcode:
				this.appendLocationArgument(this._condition.arguments[0], this._condition.arguments[1]);
				break;
			case Conditions.PaddingIs.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.PaddingIsLessThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.PaddingIsGreaterThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.GamesWonIs.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.HasHotspotTriggerAt.Opcode:
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
			case Conditions.PaddingIsNot.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
			case Conditions.TileAtIsAgain.Opcode:
				this.appendLocationArgument(
					this._condition.arguments[1],
					this._condition.arguments[2],
					this._condition.arguments[3]
				);
				this.appendTileArgument(this._condition.arguments[0]);
				break;
			case Conditions.GamesWonIsGreaterThan.Opcode:
				this.appendNumberArgument(this._condition.arguments[0]);
				break;
		}
	}
}

export default ConditionComponent;
