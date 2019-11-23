import "./symbolic-coverage.scss";

import { Component } from "src/ui";
import DataManager from "../data-manager";
import {
	Condition,
	Instruction,
	ConditionsByName,
	InstructionsByName,
	ConditionsByOpcode,
	InstructionsByOpcode
} from "src/engine/script";

import { min, max } from "src/std/math";

type DataPoint = {
	type: "Condition" | "Instruction";
	name: string;
	description: string;
	opcode: number;
	hits: number;
};

type SortDescriptor = (dp1: DataPoint, dp2: DataPoint) => number;
function sortBy(key: keyof DataPoint) {
	return (dp1: DataPoint, dp2: DataPoint) => {
		const v1 = dp1[key];
		const v2 = dp2[key];

		if (typeof v1 === "string") {
			return (v1 as string).localeCompare((v2 as unknown) as string);
		}

		return (v1 as number) - (v2 as number);
	};
}

class SymbolicCoverage extends Component {
	public static readonly tagName = "wf-editor-symbolic-coverage";
	public static readonly observedAttributes: string[] = [];
	public data: DataManager;
	private _coverage: {
		instructions: {
			[_: number]: number;
		};
		conditions: {
			[_: number]: number;
		};
	} = null;
	private _invertSortDescriptor = false;
	private _datapoints: DataPoint[];
	private _columns: [string, SortDescriptor][] = [
		["Type", sortBy("type")],
		["Opcode", sortBy("opcode")],
		["Name", sortBy("name")],
		["Hits", sortBy("hits")],
		["Description", sortBy("description")]
	];
	private _sortDescriptor: (dp1: DataPoint, dp2: DataPoint) => number;

	constructor() {
		super();
		this._sortDescriptor = this._columns[0][1];
	}

	connectedCallback() {
		super.connectedCallback();
		this.rebuild();
	}

	disconnectedCallback() {
		this.firstElementChild.remove();
		this.firstElementChild.remove();
		super.disconnectedCallback();
	}

	private rebuild() {
		this.textContent = "";
		this.appendChild(this.renderOverview());
		this.appendChild(this.renderCoverageTable());
	}

	private renderOverview() {
		function pcnt(percentage: number): string {
			const number = (percentage * 100).toFixed(2).replace(".00", "");

			return number + "%";
		}
		function n(number: number): string {
			return number.toString();
		}

		const instructionsTotal = Object.values(this.coverage.instructions).length;
		const instructionsCovered = Object.values(this.coverage.instructions).reduce(
			(acc, i) => acc + (i > 0 ? 1 : 0),
			0
		);
		const conditionsTotal = Object.values(this.coverage.conditions).length;
		const conditionsCovered = Object.values(this.coverage.conditions).reduce(
			(acc, i) => acc + (i > 0 ? 1 : 0),
			0
		);

		const totalCovered = conditionsCovered + instructionsCovered;
		const total = instructionsTotal + conditionsCovered;

		return (
			<div>
				<span>
					<span className="percentage">{pcnt(totalCovered / total)}</span> Total{" "}
					<span className="details">
						{n(totalCovered)}/{n(total)}
					</span>
				</span>
				<span>
					<span className="percentage">{pcnt(conditionsCovered / conditionsTotal)}</span> Conditions{" "}
					<span className="details">
						{n(conditionsCovered)}/{n(conditionsTotal)}
					</span>
				</span>
				<span>
					<span className="percentage">{pcnt(instructionsCovered / instructionsTotal)}</span>{" "}
					Instructions{" "}
					<span className="details">
						{n(instructionsCovered)}/{n(instructionsTotal)}
					</span>
				</span>
			</div>
		);
	}

	private renderCoverageTable() {
		return (
			<table>
				<thead>
					<tr>
						{this._columns.map(([t, s]) => (
							<th
								className={t === "" ? "extend-previous-cell" : ""}
								onclick={() => (this.sortDescriptor = s)}
							>
								{t}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{this.datapoints.sort(this.sortDescriptor).map(dp => this.row(dp))}</tbody>
			</table>
		);
	}

	private get datapoints() {
		if (this._datapoints) return this._datapoints;
		this._datapoints = [];

		const prepare = (
			type: "Condition" | "Instruction",
			nameMap: typeof ConditionsByName | typeof InstructionsByName,
			store: typeof ConditionsByOpcode | typeof InstructionsByOpcode
		) => ([opcode, hits]: [string, number]) => ({
			type,
			hits,
			opcode: +opcode,
			name: Object.keys(nameMap).find(key => (nameMap as any)[key].Opcode === +opcode),
			description: store[+opcode].Description ?? ""
		});

		const conditionData = Object.entries(this._coverage.conditions).map(
			prepare("Condition", ConditionsByName, ConditionsByOpcode)
		);
		const instructionData = Object.entries(this._coverage.instructions).map(
			prepare("Instruction", InstructionsByName, InstructionsByOpcode)
		);

		return (this._datapoints = conditionData.concat(instructionData));
	}

	private row(dp: DataPoint) {
		function colorClass(coverage: number): string {
			if (coverage > 0.75) return "high";
			if (coverage > 0.5) return "medium";
			return "low";

			if (coverage > 0.75) return "rgb(230,245,208)"; // green (light)
			if (coverage > 0.5) return "#fff4c2";
			// yellow (light)
			else return "#FCE1E5"; // red (light)
		}

		return (
			<tr>
				<td className={colorClass(dp.hits)}>{dp.type}</td>
				<td className={colorClass(dp.hits)}>{dp.opcode.toHex(2)}</td>
				<td className={colorClass(dp.hits)}>{dp.name}</td>
				<td className={"center " + colorClass(dp.hits)}>{dp.hits.toString()}</td>
				<td className={colorClass(dp.hits)}>{dp.description}</td>
			</tr>
		);
	}

	public set sortDescriptor(s) {
		if (this._sortDescriptor === s) {
			this._invertSortDescriptor = !this._invertSortDescriptor;
		} else {
			this._invertSortDescriptor = false;
		}
		this._sortDescriptor = s;

		this.rebuild();
	}

	public get sortDescriptor() {
		if (this._invertSortDescriptor)
			return (a: DataPoint, b: DataPoint) => -1 * this._sortDescriptor(a, b);

		return this._sortDescriptor;
	}

	public set coverage(coverage) {
		this._coverage = coverage;
	}

	public get coverage() {
		return this._coverage;
	}
}

export default SymbolicCoverage;
