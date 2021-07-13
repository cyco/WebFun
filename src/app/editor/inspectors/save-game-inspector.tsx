import "./save-game-inspector.scss";

import { DiscardingOutputStream, OutputStream, download, observable } from "src/util";

import AbstractInspector from "./abstract-inspector";
import { EditorView } from "src/app/save-game-editor";
import GameController from "src/app/webfun/game-controller";
import { IconButton } from "src/ui/components";
import MutableStory from "src/app/editor/mutable-story";
import World from "src/engine/world";
import { Writer } from "src/engine/save-game";
import { AssetManager } from "src/engine";
import { Zone, Puzzle, Tile, Sound, Char } from "src/engine/objects";
import { Yoda } from "src/variant";
import { WorldSize } from "src/engine/generation";
import ServiceContainer from "../service-container";
import { defaultSettings } from "src/settings";

class SaveGameInspector extends AbstractInspector {
	private _editorView: EditorView = (
		<EditorView state={this.state.prefixedWith("editor-view")} />
	) as EditorView;

	constructor(state: Storage, di: ServiceContainer) {
		super(state, di);

		this.window.title = "Save Game Inspector";
		this.window.autosaveName = "save-game-inspector";
		this.window.content.style.flexDirection = "column";
		this.window.classList.add("wf-resource-editor-save-game-inspector");
		this.window.addTitlebarButton(
			<IconButton
				icon="download"
				title="Download modified save game"
				onclick={() => this.downloadSaveGame()}
			/>
		);
		this.window.addTitlebarButton(
			<IconButton
				icon="play"
				title="Load and play this save game"
				onclick={() => this.playSaveGame()}
			/>
		);
	}

	build(): void {
		this._editorView.presentState(this.data.state, this.data.currentData, this.data.palette);
		this.window.content.appendChild(this._editorView);
	}

	public downloadSaveGame(): void {
		const state = this._editorView.saveGame;
		const data = this._editorView.data;
		const assets = new AssetManager();
		assets.populate(Zone, data.zones);
		assets.populate(Tile, data.tiles);
		assets.populate(Puzzle, data.puzzles);
		assets.populate(Char, data.characters);
		assets.populate(Sound, data.sounds);

		const writer = new Writer(assets);

		const countingStream = new DiscardingOutputStream();
		writer.write(state, countingStream);
		const stream = new OutputStream(countingStream.offset);
		writer.write(state, stream);

		download(stream.buffer, "savegame.wld");
	}

	public playSaveGame(): void {
		const base = JSON.parse(process.env["WEBFUN_GAMES"])[0];
		const controller = new GameController(Yoda, base, observable(defaultSettings));
		controller.data = this.data.currentData.copy();
		controller.palette = this.data.palette.slice();

		const data = controller.data;
		const engine = controller.engine;
		const state = this.data.state;
		const story = new MutableStory(state.seed, state.planet, WorldSize.Medium);
		//story.world = this._createWorld(state.world);
		//story.dagobah = this._createWorld(state.dagobah);

		engine.inventory.removeAllItems();
		Array.from(state.inventoryIDs).forEach(id => engine.inventory.addItem(data.tiles[id]));

		engine.hero.ammo = state.currentAmmo;
		engine.hero.weapon = state.currentWeapon !== -1 ? data.characters[state.currentWeapon] : null;
		engine.hero.location = state.positionOnZone;
		engine.hero.health = (4 - state.livesLost) * 100 - state.damageTaken;
		engine.currentWorld = state.onDagobah ? story.dagobah : story.world;

		engine.story = story;

		engine.assets.populate(Zone, data.zones);
		engine.assets.populate(Tile, data.tiles);
		engine.assets.populate(Puzzle, data.puzzles);
		engine.assets.populate(Char, data.characters);
		engine.assets.populate(Sound, data.sounds);

		controller.show(this.window.manager);
		controller.jumpStartEngine(controller.data.zones[state.currentZoneID]);
	}

	private _createWorld(world: World): World {
		const data = this._editorView.data;
		const assets = new AssetManager();
		assets.populate(Zone, data.zones);
		assets.populate(Tile, data.tiles);
		assets.populate(Puzzle, data.puzzles);
		assets.populate(Char, data.characters);
		assets.populate(Sound, data.sounds);
		const result = new World(assets);

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const input = world.at(x, y);
				const out = result.at(x, y);

				out.zone = input.zone;
				out.additionalRequiredItem = input.additionalRequiredItem;
				out.findItem = input.findItem;
				out.npc = input.npc;
				out.requiredItem = input.requiredItem;
				out.zoneType = input.zoneType;
				out.zone.visited = input.visited;
				out.solved1 = input.solved1;
				out.solved2 = input.solved2;
				out.solved3 = input.solved3;
				out.solved4 = input.solved4;
				out.visited = input.visited;
				out.additionalGainItem = input.additionalGainItem;
				out.puzzleIndex = input.puzzleIndex;
				out.isGoal = input.isGoal;
			}
		}

		return result;
	}
}

export default SaveGameInspector;
