import { Window, List } from "src/ui/components";
import { SaveGameReader, SaveState } from "src/engine/save-game";
import { InputStream } from "src/util";
import DataManager from "src/editor/data-manager";
import { Planet, WorldSize } from "src/engine/types";
import { AmmoControl, Tile as TileComponent, Map, InventoryRow } from "./components";
import { Ammo, Health } from "src/app/ui";
import { Tile } from "src/engine/objects";
import { Yoda } from "src/engine";
import {iterate}from 'src/util';
import {File} from 'src/std.dom';

import "./save-game-editor.scss";

class SaveGameEditor extends Window {
	public static TagName: string = "wf-save-game-editor";
	private _gameDataManager: DataManager;
	public file: File;
	private _state: SaveState;
	private _label: Element = <div className="label" />;
	private _errors: Element = <div className="errors" />;
	private _save: Element = <div className="save" />;

	constructor() {
		super();

		this.title = "Save Game Editor";
		this.closable = true;

		this.content.appendChild(this._label);
		this.content.appendChild(this._errors);
		this.content.appendChild(this._save);
	}

	async connectedCallback() {
		super.connectedCallback();
		this._presentFile(this.file);
	}

	private async _presentFile(file: File) {
		this.title = file.name;
		const { save, error } = await this._loadFile(file);
		this._presentError(error);
		this._presentState(save);
		this._state = save;
	}

	private _presentFileName(name: string) {
		this._label.textContent = name;
	}

	private _presentError(error?: Error) {
		if (!error) {
			this._errors.textContent = "";
			return;
		}

		this._errors.textContent = error.message;
	}

	private _presentState(state: SaveState) {
		this._save.textContent = "";

		this._save.appendChild(<div className="row">
			<span><label>Seed</label><input value={state.seed.toHex(4)} /></span>
			<span><label>Planet</label><input value={state.planet.name} /></span>
		</div>);

		this._save.appendChild(<Map
			dataProvider={this._gameDataManager}
			world={state.world}
			location={state.positionOnWorld}
			/>);

		// health, current weapon, current ammo
		const currentWeapon = this._findWeaponFace(state.currentWeapon);
		this._save.appendChild(
			<div className="weapon-and-health">
				{this._buildAmmoRow(currentWeapon, state.currentAmmo, 30)}
				<Health />
			</div>);

		// ammo supply
		this._save.appendChild(this._buildAmmoRow(this._findWeaponFace(Yoda.WeaponID.Blaster), state.blasterAmmo, 30));
		this._save.appendChild(this._buildAmmoRow(this._findWeaponFace(Yoda.WeaponID.BlasterRifle), state.blasterRifleAmmo, 15));
		this._save.appendChild(this._buildAmmoRow(this._findWeaponFace(Yoda.WeaponID.TheForce), state.forceAmmo, 15));

		// items
		const tileSheet = this.gameDataManager.tileSheet;
		const inventory = <List className="inset-border-1px"
						cell={<InventoryRow tileSheet={tileSheet}/>} items={Array.from(state.inventoryIDs).map(id => this._gameDataManager.currentData.tiles[id])} />
		this._save.appendChild(inventory);
	}

	private _buildTileComponent(tile: Tile): TileComponent {
		const tileSheet = this.gameDataManager.tileSheet;
		return <TileComponent tile={tile} tileSheet={tileSheet} /> as TileComponent;
	}

	private _findWeaponFace(id: number): Tile {
		if (!id) return null;

		const character = this.gameDataManager.currentData.characters[id];
		if (!character) return null;
		console.assert(character.isWeapon());
		return character.frames[0].extensionRight;
	}

	private _buildAmmoRow(tile: Tile, value: number, total: number) {
		return <div className="ammo">
			{this._buildTileComponent(tile)}
			<AmmoControl vertical value={value} />
		</div>;
	}

	private async _loadFile(file: File) {
		let stream: InputStream, reader: SaveGameReader, result: SaveState;
		try {
			stream = await file.provideInputStream();
			reader = new SaveGameReader(this.gameDataManager.currentData);
			return { save: await reader.read(stream), error: null };
		} catch (error) {
			return { error, save: reader.partialState };
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
	}

	public set gameDataManager(dataManager: DataManager) {
		this._gameDataManager = dataManager;
	}

	public get gameDataManager() {
		return this._gameDataManager;
	}
}

export default SaveGameEditor;
