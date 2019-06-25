import "./save-game-inspector.scss";

import { DiscardingOutputStream, OutputStream, download } from "src/util";

import AbstractInspector from "./abstract-inspector";
import { EditorView } from "src/save-game-editor";
import GameController from "src/app/game-controller";
import { IconButton } from "src/ui/components";
import MutableStory from "src/engine/mutable-story";
import SaveGameWorld from "src/engine/save-game/world";
import { World } from "src/engine/generation";
import { Writer } from "src/engine/save-game";
import { AssetManager } from "src/engine";
import { Zone, Puzzle, Tile, Sound, Char } from "src/engine/objects";
import { Yoda } from "src/engine/type";
import Settings from "src/settings";

class SaveGameInspector extends AbstractInspector {
	private _editorView: EditorView = (
		<EditorView state={this.state.prefixedWith("editor-view")} />
	) as EditorView;

	constructor(state: Storage) {
		super(state);

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

	build() {
		this._editorView.presentState(this.data.state, this.data.currentData, this.data.palette);
		this.window.content.appendChild(this._editorView);
	}

	public downloadSaveGame(): void {
		const state = this._editorView.saveGame;
		const data = this._editorView.data;
		const assetManager = new AssetManager();
		assetManager.populate(Zone, data.zones);
		assetManager.populate(Tile, data.tiles);
		assetManager.populate(Puzzle, data.puzzles);
		assetManager.populate(Char, data.characters);
		assetManager.populate(Sound, data.sounds);

		const writer = new Writer(assetManager);

		const countingStream = new DiscardingOutputStream();
		writer.write(state, countingStream);
		const stream = new OutputStream(countingStream.offset);
		writer.write(state, stream);

		download(stream.buffer, "savegame.wld");
	}

	public playSaveGame(): void {
		const controller = new GameController(Yoda, Settings.url.yoda);
		controller.data = this.data.currentData.copy();
		controller.palette = this.data.palette.slice();

		const data = controller.data;
		const engine = controller.engine;
		const state = this.data.state;
		const story = new MutableStory(state.seed, state.planet, state.worldSize);
		story.world = this._createWorld(state.world);
		story.dagobah = this._createWorld(state.dagobah);

		engine.inventory.removeAllItems();
		Array.from(state.inventoryIDs).forEach(id => engine.inventory.addItem(data.tiles[id]));

		engine.hero.ammo = state.currentAmmo;
		engine.hero.weapon = state.currentWeapon !== -1 ? data.characters[state.currentWeapon] : null;
		engine.hero.location = state.positionOnZone;
		engine.hero.health = (4 - state.livesLost) * 100 - state.damageTaken;
		engine.currentWorld = state.onDagobah ? story.dagobah : story.world;

		engine.story = story;

		engine.assetManager.populate(Zone, data.zones);
		engine.assetManager.populate(Tile, data.tiles);
		engine.assetManager.populate(Puzzle, data.puzzles);
		engine.assetManager.populate(Char, data.characters);
		engine.assetManager.populate(Sound, data.sounds);

		controller.show(this.window.manager);
		controller.jumpStartEngine(controller.data.zones[state.currentZoneID]);
	}

	private _createWorld(world: SaveGameWorld): World {
		const result = new World();

		const zones = this.data.currentData.zones;
		const tiles = this.data.currentData.tiles;

		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				const input = world.getWorldItem(x, y);
				const out = result.at(x, y);

				result.setZone(x, y, zones[input.zoneId] || null);
				out.additionalRequiredItem = tiles[input.additionalRequiredItem] || null;
				// input.field16;
				// input.fieldC;
				// input.fieldEA;
				// TODO: puzzle idx and puzzle index are missing
				out.findItem = tiles[input.findItemID] || null;
				out.npc = tiles[input.npcID] || null;
				out.requiredItem = tiles[input.requiredItemId] || null;
				out.zone = zones[input.zoneId] || null;
				out.zoneType = Zone.Type.fromNumber(input.zoneType);
				if (out.zone) out.zone.visited = input.visited;
				if (out.zone) out.zone.solved = input.solved1 !== 0;
				console.assert(
					input.solved1 === input.solved2 &&
						input.solved2 === input.solved3 &&
						input.solved3 === input.solved4
				);
			}
		}

		return result;
	}
}

export default SaveGameInspector;
