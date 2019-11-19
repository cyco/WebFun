import AbstractInspector from "./abstract-inspector";
import { InlineSelector, ProgressIndicator } from "src/ui/components";
import "./coverage-inspector.scss";

class CoverageInspector extends AbstractInspector {
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

	constructor(state: Storage) {
		super(state);

		this.window.title = "Coverage";
		this.window.autosaveName = "coverage-inspector";
		this.window.content.style.height = "604px";
		this.window.content.style.flexDirection = "row";
		this.window.classList.add("wf-coverage-inspector");
	}

	public async build() {
		if (!this._coverage) {
			this.window.content.textContent = "";
			this.window.content.appendChild(<ProgressIndicator />);

			this._coverage = JSON.parse(await this.loadCoverage());
			if (this._coverage) this.build();
		} else {
			this.window.content.textContent = "";
			const table = (
				<table>
					<thead>
						<tr>
							{["Zone", "Total", "", "Actions", "", "Conditions", "", "Instructions", ""].map(
								t => (
									<th className={t === "" ? "extend-previous-cell" : ""}>{t}</th>
								)
							)}
						</tr>
					</thead>
					<tbody>{this.datapoints.map(dp => this.row(dp))}</tbody>
				</table>
			);
			this.window.content.appendChild(table);
		}
	}

	private get datapoints() {
		return this.data.currentData.zones.map(zone => {
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
	}

	private row(dp: any) {
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

	private async loadCoverage(): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new XMLHttpRequest();
			reader.open("GET", "assets/ingame-coverage.json");
			reader.onload = _ => resolve(reader.response);
			reader.onerror = event => reject(event);
			reader.send(void 0);
		});
	}
}

export default CoverageInspector;
