import { Window, List, Segment, SegmentControl } from "src/ui/components";
import { SaveGameReader, SaveState } from "src/engine/save-game";
import { InputStream, iterate } from "src/util";
import DataManager from "src/editor/data-manager";
import { Planet, WorldSize } from "src/engine/types";
import {
  AmmoControl,
  Tile as TileComponent,
  Map,
  InventoryRow
} from "./components";
import { Ammo, Health } from "src/app/ui";
import { Tile } from "src/engine/objects";
import { Yoda } from "src/engine";
import { File } from "src/std.dom";

import "./save-game-editor.scss";

class SaveGameEditor extends Window {
  public static TagName: string = "wf-save-game-editor";
  private _gameDataManager: DataManager;
  public file: File;
  private _state: SaveState;
  private _save: Element = <div className="save" />;

  constructor() {
    super();

    this.title = "Save Game Editor";
    this.closable = true;

    this.content.appendChild(this._save);
  }

  async connectedCallback() {
    super.connectedCallback();
    this._presentFile(this.file);
  }

  private async _presentFile(file: File) {
    this.title = file.name;
    const { save, error } = await this._loadFile(file);
    this._presentState(save);
    this._state = save;
  }

  private _presentState(state: SaveState) {
    const node = this._buildNodes(state);
    const oldSave = this._save;
    this._save = node;

    oldSave.parentElement.replaceChild(node, oldSave);
  }

  private _showSegment(segment: Segment): void {
    Array.from(this._save.querySelectorAll(".content")).forEach(
      (c: HTMLElement) => (c.style.display = "none")
    );
    const r = this._save.querySelector(
      ".content." + segment.textContent
    ) as HTMLElement;
    r.style.display = "";
  }

  private _buildNodes(state: SaveState) {
    const currentWeapon = this._findWeaponFace(state.currentWeapon);
    const tileSheet = this.gameDataManager.tileSheet;

    return (
      <div className="save">
        <span className="seed">
          <label>Seed</label>
          <input value={state.seed.toHex(4)} />
        </span>
        <span className="planet">
          <label>Planet</label>
          <input value={state.planet.name} />
        </span>

        <div className="current-weapon">
          <TileComponent tile={currentWeapon} tileSheet={tileSheet} />
          <AmmoControl vertical value={state.currentAmmo} />
        </div>

        <Health />

        <SegmentControl
          onsegmentchange={(segment: Segment) => this._showSegment(segment)}
        >
          <Segment selected>World</Segment>
          <Segment>Dagobah</Segment>
          <Segment>Inventory</Segment>
        </SegmentControl>

        <Map
          className="content World"
          dataProvider={this._gameDataManager}
          world={state.world}
          location={!state.onDagobah ? state.positionOnWorld : null}
        />

        <Map
          className="content Dagobah"
          dataProvider={this._gameDataManager}
          world={state.dagobah}
          location={state.onDagobah ? state.positionOnWorld : null}
        />

        <List
          className="content Inventory inset-border-1px"
          cell={<InventoryRow tileSheet={tileSheet} />}
          items={Array.from(state.inventoryIDs).map(
            id => this._gameDataManager.currentData.tiles[id]
          )}
        />
      </div>
    );
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
    return (
      <div className="ammo">
        {this._buildTileComponent(tile)}
        <AmmoControl vertical value={value} />
      </div>
    );
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
