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
	private _orderBy = (
		<InlineSelector
			onchange={(_: CustomEvent) => this.build()}
			options={[
				{
					value: "zone-id",
					label: "Zone"
				},
				{
					value: "coverage",
					label: "% hit"
				}
			]}
			value="zone-id"
		/>
	) as InlineSelector<string>;

	constructor(state: Storage) {
		super(state);

		this.window.title = "Coverage";
		this.window.autosaveName = "coverage-inspector";
		this.window.style.width = "514px";
		this.window.content.style.height = "604px";
		this.window.content.style.flexDirection = "row";
		this.window.classList.add("wf-coverage-inspector");

		this.window.addTitlebarButton(this._orderBy);
	}

	public async build() {
		if (!this._coverage) {
			this.window.content.textContent = "";
			this.window.content.appendChild(<ProgressIndicator />);

			this._coverage = JSON.parse(await this.loadCoverage());
			if (this._coverage) this.build();
		} else {
			this.window.content.textContent = "";

			const table = this.data.currentData.zones
				.map(zone => {
					const actions = zone.actions.map((_, i) => this._coverage.actions[`${zone.id}_${i}`]);
					const coveredActions =
						actions.reduce(
							(acc: number, ac) =>
								acc +
								(ac.conditions.some(i => i > 0) || ac.instructions.some(i => i > 0) ? 1 : 0),
							0
						) / (zone.actions.length || 1);
					const coveredConditions =
						actions.reduce(
							(acc: number, ac) =>
								acc + ac.conditions.map(i => (i > 0 ? 1 : 0)).reduce((a, b) => a + b, 0),
							0
						) / (actions.reduce((acc: number, ac) => acc + ac.conditions.length, 0) || 1);
					const coveredInstructions =
						actions.reduce(
							(acc: number, ac) =>
								acc + ac.instructions.map(i => (i > 0 ? 1 : 0)).reduce((a, b) => a + b, 0),
							0
						) / (actions.reduce((acc: number, ac) => acc + ac.instructions.length, 0) || 1);

					return {
						zone: zone.id,
						actions: coveredActions,
						conditions: coveredConditions,
						instructions: coveredInstructions,
						total: (coveredActions + coveredConditions + coveredInstructions) / 3
					};
				})
				.reduce(
					(container, dp) => (
						[
							<span className={this.colorClass(dp.total)}>Zone {dp.zone.toString()}</span>,
							<span className={this.colorClass(dp.total)}>
								<div className="bar-chart">
									<div style={{ width: (100 * dp.total).toFixed(2) + "%" }}></div>
								</div>
							</span>,
							<span className={"center " + this.colorClass(dp.total)}>
								{this.fmt(dp.total)}
							</span>,
							<span className={"center " + this.colorClass(dp.actions)}>
								{this.fmt(dp.actions)}
							</span>,
							<span className={"center " + this.colorClass(dp.conditions)}>
								{this.fmt(dp.conditions)}{" "}
							</span>,
							<span className={"center " + this.colorClass(dp.instructions)}>
								{this.fmt(dp.instructions)}{" "}
							</span>
						].forEach(e => container.appendChild(e)),
						container
					),
					document.createElement("div")
				);
			table.classList.add("table");
			this.window.content.appendChild(table);
		}
	}

	private fmt(percentage: number): string {
		const number = (percentage * 100).toFixed(2).replace(".00", "");

		return number + " %";
	}

	private colorClass(coverage: number): string {
		if (coverage > 0.75) return "high";
		if (coverage > 0.5) return "medium";
		return "low";

		if (coverage > 0.75) return "rgb(230,245,208)"; // green (light)
		if (coverage > 0.5) return "#fff4c2";
		// yellow (light)
		else return "#FCE1E5"; // red (light)
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
