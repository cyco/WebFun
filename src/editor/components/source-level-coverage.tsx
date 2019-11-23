import "./source-level-coverage.scss";

import { Component } from "src/ui";
import DataManager from "../data-manager";
import { DiscardingStorage } from "src/util";

type DataPoint = {
	zone: number;
	actionsTotal: number;
	actionsCovered: number;
	actions: number;
	conditionsTotal: number;
	conditionsCovered: number;
	conditions: number;
	instructionsTotal: number;
	instructionsCovered: number;
	instructions: number;
	total: number;
};

type SortDescriptor = (dp1: DataPoint, dp2: DataPoint) => number;
function sortBy(key: keyof DataPoint) {
	return (dp1: DataPoint, dp2: DataPoint) => {
		return dp1[key] - dp2[key];
	};
}

const SortDescriptorKey = "sort-column";
const InvertSortDescriptorKey = "sort-inverted";
class SourceLevelCoverage extends Component {
	public static readonly tagName = "wf-editor-source-level-coverage";
	public static readonly observedAttributes: string[] = [];
	private _state: Storage = new DiscardingStorage();

	public data: DataManager;
	private _coverage: {
		zones: {
			[_: string]: {
				id: string;
				type: string;
				actionCount: string;
				conditionCount: string;
				instructionCount: string;
			};
		};
		actions: {
			[_: string]: {
				conditions: number[];
				instructions: number[];
			};
		};
	} = null;
	private _invertSortDescriptor = false;
	private _datapoints: DataPoint[];
	private _columns: [string, SortDescriptor][] = [
		["", sortBy("zone")],
		["Total", sortBy("total")],
		["", sortBy("total")],
		["Actions", sortBy("actions")],
		["", sortBy("actionsTotal")],
		["Conditions", sortBy("conditions")],
		["", sortBy("conditionsTotal")],
		["Instructions", sortBy("instructions")],
		["", sortBy("instructionsTotal")]
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
		if (!this.isConnected) return;

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

		const zonesCovered = this.datapoints.reduce((acc, dp) => (acc + dp.actionsCovered > 0 ? 1 : 0), 0);
		const zonesTotal = this.datapoints.length;

		const actionsCovered = this.datapoints.reduce((acc, dp) => acc + dp.actionsCovered, 0);
		const actionsTotal = this.datapoints.reduce((acc, dp) => acc + dp.actionsTotal, 0);

		const instructionsCovered = this.datapoints.reduce((acc, dp) => acc + dp.instructionsCovered, 0);
		const instructionsTotal = this.datapoints.reduce((acc, dp) => acc + dp.instructionsTotal, 0);

		const conditionsCovered = this.datapoints.reduce((acc, dp) => acc + dp.conditionsCovered, 0);
		const conditionsTotal = this.datapoints.reduce((acc, dp) => acc + dp.conditionsTotal, 0);

		return (
			<div>
				<span>
					<span className="percentage">{pcnt(zonesCovered / zonesTotal)}</span> Zones{" "}
					<span className="details">
						{n(zonesCovered)}/{n(zonesTotal)}
					</span>
				</span>
				<span>
					<span className="percentage">{pcnt(actionsCovered / actionsTotal)}</span> Actions{" "}
					<span className="details">
						{n(actionsCovered)}/{n(actionsTotal)}
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
		this._datapoints = this.data.currentData.zones.map(zone => {
			const actions = zone.actions.map((_, i) => this._coverage.actions[`${zone.id}_${i}`]);
			const actionsTotal = zone.actions.length;
			const actionsCovered = actions.reduce(
				(acc, a) => acc + (a.conditions.some(i => i > 0) || a.instructions.some(i => i > 0) ? 1 : 0),
				0
			);
			const actionsRatio = actionsCovered / (zone.actions.length || 1);

			const conditionsTotal = actions.reduce((acc, ac) => acc + ac.conditions.length, 0);
			const conditionsCovered = actions.reduce(
				(acc, ac) => acc + ac.conditions.map(i => (i > 0 ? 1 : 0)).reduce((a, b) => a + b, 0),
				0
			);
			const conditionsRatio = conditionsCovered / (conditionsTotal || 1);

			const instructionsTotal = actions.reduce((acc, ac) => acc + ac.instructions.length, 0);
			const instructionsCovered = actions.reduce(
				(acc: number, ac) =>
					acc + ac.instructions.map(i => (i > 0 ? 1 : 0)).reduce((a, b) => a + b, 0),
				0
			);
			const instructionsRatio = instructionsCovered / (instructionsTotal || 1);

			return {
				zone: zone.id,
				actionsTotal: actionsTotal,
				actionsCovered: actionsCovered,
				actions: actionsRatio,
				conditionsTotal: conditionsTotal,
				conditionsCovered: conditionsCovered,
				conditions: conditionsRatio,
				instructionsTotal: instructionsTotal,
				instructionsCovered: instructionsCovered,
				instructions: instructionsRatio,
				total: (actionsRatio + conditionsRatio + instructionsRatio) / 3
			};
		});
		return this._datapoints;
	}

	private row(dp: DataPoint) {
		function pcnt(percentage: number): string {
			const number = (percentage * 100).toFixed(2).replace(".00", "");

			return number + " %";
		}
		function n(number: number): string {
			return number.toString();
		}
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
				<td className={colorClass(dp.total)}>Zone {dp.zone.toString()}</td>
				<td className={colorClass(dp.total)}>
					<div className="bar-chart">
						<div style={{ width: (100 * dp.total).toFixed(2) + "%" }}></div>
					</div>
				</td>
				<td className={"center " + colorClass(dp.total)}>{pcnt(dp.total)}</td>
				<td className={"center " + colorClass(dp.actions)}>{pcnt(dp.actions)}</td>
				<td className={"center " + colorClass(dp.actions)}>
					{n(dp.actionsCovered)}/{n(dp.actionsTotal)}
				</td>
				<td className={"center " + colorClass(dp.conditions)}>{pcnt(dp.conditions)}</td>
				<td className={"center " + colorClass(dp.conditions)}>
					{n(dp.conditionsCovered)}/{n(dp.conditionsTotal)}
				</td>
				<td className={"center " + colorClass(dp.instructions)}>{pcnt(dp.instructions)}</td>
				<td className={"center " + colorClass(dp.instructions)}>
					{n(dp.instructionsCovered)}/{n(dp.instructionsTotal)}
				</td>
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

		this._state.store(
			SortDescriptorKey,
			this._columns.findIndex(([_, sd]) => s == sd)
		);
		this._state.store(InvertSortDescriptorKey, this._invertSortDescriptor);

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

	set state(state: Storage) {
		this._state = state;

		const sortColumnIdx = state.load(SortDescriptorKey) ?? 0;
		const sortColumn = this._columns[sortColumnIdx] ?? this._columns.first();
		this._sortDescriptor = sortColumn[1];
		this._invertSortDescriptor = state.load(InvertSortDescriptorKey) ?? false;

		this.rebuild();
	}

	get state() {
		return this._state;
	}
}

export default SourceLevelCoverage;
