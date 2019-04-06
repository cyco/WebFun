import "./save-game-inspector.scss";

import { DiscardingOutputStream, OutputStream, download } from "src/util";

import AbstractInspector from "./abstract-inspector";
import { ColorPalette } from "src/engine";
import { EditorView } from "src/save-game-editor";
import GameController from "src/app/game-controller";
import { IconButton } from "src/ui/components";
import MutableStory from "src/engine/mutable-story";
import SaveGameWorld from "src/engine/save-game/world";
import { World } from "src/engine/generation";
import { Writer } from "src/engine/save-game";
import { ZoneType } from "src/engine/objects";

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
		const writer = new Writer(this._editorView.data);

		const countingStream = new DiscardingOutputStream();
		writer.write(state, countingStream);
		const stream = new OutputStream(countingStream.offset);
		writer.write(state, stream);

		download(stream.buffer, "savegame.wld");
	}

	public playSaveGame(): void {
		const controller = new GameController();
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
		engine.data = data;

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
				// input.field_16;
				// input.field_C;
				// input.field_Ea;
				// TODO: puzzle idx and puzzle index are missing
				out.findItem = tiles[input.find_item_id] || null;
				out.npc = tiles[input.npc_id] || null;
				out.requiredItem = tiles[input.required_item_id] || null;
				out.zone = zones[input.zoneId] || null;
				out.zoneType = ZoneType.fromNumber(input.zoneType);
				if (out.zone) out.zone.visited = input.visited;
				if (out.zone) out.zone.solved = input.solved_1 !== 0;
				console.assert(
					input.solved_1 === input.solved_2 &&
						input.solved_2 === input.solved_3 &&
						input.solved_3 === input.solved_4
				);
			}
		}

		return result;
	}
}

export default SaveGameInspector;
