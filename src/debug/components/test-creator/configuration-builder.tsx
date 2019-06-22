import "./configuration-builder.scss";

import { Component } from "src/ui";
import { DiscardingStorage } from "src/util";
import { SegmentControl, Segment } from "src/ui/components";
import { Configuration } from "src/debug/automation/test";
import SimulationConfigurationBuilder from "./simulation-configuration-builder";
import WorldConfigurationBuilder from "./world-configuration-builder";

class ConfigurationBuilder extends Component {
	public static readonly tagName = "wf-debug-test-creator-configuration-builder";
	private _state: Storage = new DiscardingStorage();
	private _simulationConfigurationBuilder = (
		<SimulationConfigurationBuilder />
	) as SimulationConfigurationBuilder;
	private _worldConfigurationBuilder = <WorldConfigurationBuilder /> as WorldConfigurationBuilder;

	public connectedCallback() {
		super.connectedCallback();

		this.append(
			...[
				<SegmentControl
					onsegmentchange={(segment: Segment) => {
						this.querySelectorAll("#world,#simulation").forEach(
							(n: HTMLElement) => (n.style.display = "none")
						);

						const target = this.querySelector("#" + segment.className) as HTMLElement;
						target.style.display = "";
					}}
					state={this._state.prefixedWith("selector")}
				>
					<Segment className="world">New World</Segment>
					<Segment className="simulation">Simulation</Segment>
				</SegmentControl>,
				<div id="world">{this._worldConfigurationBuilder}</div>,
				<div id="simulation">{this._simulationConfigurationBuilder}</div>
			]
		);
	}

	public disconnectedCallback() {
		this.textContent = "";
		super.disconnectedCallback();
	}

	public set configuration(config: Configuration) {
		const { zone, findItem, puzzleNPC, requiredItem1, requiredItem2, inventory } = config;
	}

	public get configuration(): Configuration {
		return {} as any;
	}

	public set gameData(p) {
		this._simulationConfigurationBuilder.gameData = p;
	}

	public get gameData() {
		return this._simulationConfigurationBuilder.gameData;
	}

	public set palette(p) {
		this._simulationConfigurationBuilder.palette = p;
	}

	public get palette() {
		return this._simulationConfigurationBuilder.palette;
	}

	public set state(s) {
		this._state = s;
		this._simulationConfigurationBuilder.state = s.prefixedWith("simulation");
		this._worldConfigurationBuilder.state = s.prefixedWith("world");
		const segmentControl = this.querySelector(SegmentControl.tagName) as SegmentControl;
		if (segmentControl) segmentControl.state = s.prefixedWith("selector");
	}

	public get state() {
		return this._state;
	}
}

export default ConfigurationBuilder;
