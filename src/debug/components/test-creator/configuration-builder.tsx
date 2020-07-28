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
	private _worldConfigurationBuilder = (<WorldConfigurationBuilder />) as WorldConfigurationBuilder;
	private _initialConfiguration: Configuration;

	public connectedCallback() {
		super.connectedCallback();

		const config: Configuration = this._initialConfiguration ?? {
			inventory: [],
			tags: [],
			seed: 0,
			difficulty: 50
		};
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
					state={this._state.prefixedWith("selector")}>
					<Segment className="world" selected={config.zone < 0}>
						New World
					</Segment>
					<Segment className="simulation" selected={config.zone >= 0}>
						Simulation
					</Segment>
				</SegmentControl>,
				<div id="world">{this._worldConfigurationBuilder}</div>,
				<div id="simulation">{this._simulationConfigurationBuilder}</div>
			]
		);

		if (this._initialConfiguration) this.configuration = config;
	}

	public disconnectedCallback() {
		this.textContent = "";
		super.disconnectedCallback();
	}

	public set configuration(config: Configuration) {
		this._simulationConfigurationBuilder.configuration = config;
		this._worldConfigurationBuilder.configuration = config;
		this._initialConfiguration = config;

		if (!this.isConnected) return;

		if (config.zone >= 0) {
			this._worldConfigurationBuilder.parentElement.style.display = "none";
			this._simulationConfigurationBuilder.parentElement.style.display = "";
		} else {
			this._worldConfigurationBuilder.parentElement.style.display = "";
			this._simulationConfigurationBuilder.parentElement.style.display = "none";
		}
	}

	public get configuration(): Configuration {
		return this.currentBuilder.configuration;
	}

	private get currentBuilder() {
		if (this._simulationConfigurationBuilder.parentElement.style.display === "none") {
			return this._worldConfigurationBuilder;
		}

		return this._simulationConfigurationBuilder;
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
