import "./world-configuration-builder.scss";

import { Component } from "src/ui";
import { DiscardingStorage } from "src/util";
import { Selector, Textbox } from "src/ui/components";
import { Planet, WorldSize } from "src/engine/types";
import { Configuration } from "src/debug/automation/test";

class WorldConfigurationBuilder extends Component {
	public static readonly tagName = "wf-debug-test-creator-world-configuration-builder";
	private _state: Storage = new DiscardingStorage();
	private _seed: Textbox = (
		<Textbox onchange={() => this._state.store("seed", this._seed.value)} />
	) as Textbox;
	private _planet: Selector = (
		<Selector
			onchange={() => this._state.store("planet", this._planet.value)}
			options={[
				{ label: Planet.Tatooine.name, value: Planet.Tatooine.rawValue },
				{ label: Planet.Hoth.name, value: Planet.Hoth.rawValue },
				{ label: Planet.Endor.name, value: Planet.Endor.rawValue }
			]}
		/>
	) as Selector;
	private _size: Selector = (
		<Selector
			onchange={() => this._state.store("size", this._size.value)}
			options={[
				{ label: WorldSize.Small.name, value: WorldSize.Small.rawValue },
				{ label: WorldSize.Medium.name, value: WorldSize.Medium.rawValue },
				{ label: WorldSize.Large.name, value: WorldSize.Large.rawValue }
			]}
		/>
	) as Selector;
	private _gamesWon: Textbox = (
		<Textbox onchange={() => this._state.store("gamesWon", this._gamesWon.value)} />
	) as Textbox;
	private _inventory: number[];
	private _tags: string[];
	private _description: string;
	private _difficulty: number;

	public connectedCallback() {
		super.connectedCallback();

		this.append(
			<div>
				<div>
					<label>Seed</label>
					{this._seed}
				</div>
				<div>
					<label>Planet</label>
					{this._planet}
				</div>
				<div>
					<label>Size</label>
					{this._size}
				</div>
				<span style={{ marginTop: "7px", marginBottom: "7px", borderTop: "1px dashed gray" }}></span>
				<div>
					<label>Games Won</label>
					{this._gamesWon}
				</div>
			</div>
		);
	}

	public set configuration(config: Configuration) {
		if (typeof config.seed === "number") this._seed.value = config.seed.toHex(4);
		if (typeof config.planet === "number") this._planet.value = `${config.planet}`;
		if (typeof config.size === "number") this._size.value = `${config.size}`;
		if (typeof config.gamesWon === "number") this._gamesWon.value = config.gamesWon.toString(10);

		this._inventory = config.inventory;
		this._tags = config.tags;
		this._description = config.description;
		this._difficulty = config.difficulty;
	}

	public get configuration(): Configuration {
		return {
			seed: this._seed.value.parseInt(),
			planet: this._planet.value.parseInt(),
			size: this._size.value.parseInt(),
			gamesWon: this._gamesWon.value.parseInt(),
			inventory: this._inventory ?? [],
			tags: this._tags ?? [],
			description: this._description,
			difficulty: this._difficulty
		};
	}

	public set state(s) {
		this._state = s;
		this._seed.value = s.load("seed") || (0).toHex(4);
		this._planet.value = s.load("planet") || Planet.Tatooine.rawValue;
		this._size.value = s.load("size") || WorldSize.Small.rawValue;
		this._gamesWon.value = s.load("gamesWon") || "0";
	}

	public get state() {
		return this._state;
	}
}

export default WorldConfigurationBuilder;
