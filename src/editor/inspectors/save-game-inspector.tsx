import AbstractInspector from "./abstract-inspector";
import { IconButton } from "src/ui/components";
import { EditorView } from "src/save-game-editor";
import { Writer } from "src/engine/save-game";
import MutableStory from "src/engine/mutable-story";
import { download, OutputStream, DiscardingOutputStream } from "src/util";
import GameController from "src/app/game-controller";
import { World } from "src/engine/generation";
import SaveGameWorld from "src/engine/save-game/world";
import { ZoneType } from "src/engine/objects";
import "./save-game-inspector.scss";
import TileImageLoader from "src/app/tile-image-loader";

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
		controller.palette = new Uint8Array(this.data.palette);

		const state = this.data.state;
		const story = new MutableStory(state.seed, state.planet, state.worldSize);
		story.world = this._createWorld(state.world);
		story.dagobah = this._createWorld(state.dagobah);

		controller.engine.story = story;
		controller.engine.data = controller.data;
		controller.show(this.window.manager);

		controller.engine.renderer.imageFactory.palette = controller.palette;
		const imageLoader = new TileImageLoader();
		imageLoader.load(
			controller.data.tiles,
			controller.engine.renderer.imageFactory,
			(): void => void 0,
			() => {
				controller.jumpStartEngine(controller.data.zones[state.currentZoneID]);
			}
		);
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
				console.log("input.zoneType", input, input.zoneType);
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
