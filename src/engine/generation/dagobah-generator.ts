import AssetManager from "src/engine/asset-manager";
import { Tile, Zone, Hotspot, Puzzle } from "src/engine/objects";
import { Yoda } from "src/variant";
import { randmod } from "src/util";
import SaveState, { SavedHotspot, SavedWorld } from "../save-game/save-state";

enum YodaSpawn {
	NorthWest = 0,
	Hut = 1,
	SouthEast = 2,
	SouthWest = 3,
	None = 4
}

class DagobahGenerator {
	private readonly assets: AssetManager;
	private state: SaveState;

	constructor(assets: AssetManager) {
		this.assets = assets;
	}

	private makeSector() {
		return {
			visited: false,
			solved1: false,
			solved2: false,
			solved3: false,
			solved4: false,
			zone: -1,

			puzzleIndex: -1,
			usedAlternateStrain: false,
			isGoal: true,

			findItem: -1,
			requiredItem: -1,
			additionalGainItem: -1,
			additionalRequiredItem: -1,
			npc: -1,

			type: Zone.Type.None
		};
	}

	public generate(state: SaveState, goal: Puzzle, item: Tile): SavedWorld {
		try {
			this.state = state;
			const dagobah: SavedWorld = {
				sectors: []
			};
			dagobah.sectors[4 * 10 + 4] = this.makeSector();
			dagobah.sectors[4 * 10 + 5] = this.makeSector();
			dagobah.sectors[5 * 10 + 4] = this.makeSector();
			dagobah.sectors[5 * 10 + 5] = this.makeSector();

			dagobah.sectors[4 * 10 + 4].zone = Yoda.zoneIDs.DagobahNorthWest;
			dagobah.sectors[4 * 10 + 5].zone = Yoda.zoneIDs.DagobahNorthEast;
			dagobah.sectors[5 * 10 + 4].zone = Yoda.zoneIDs.DagobahSouthWest;
			dagobah.sectors[5 * 10 + 5].zone = Yoda.zoneIDs.DagobahSouthEast;

			dagobah.sectors[4 * 10 + 4].type = state.world.sectors[4 * 10 + 4]?.type ?? Zone.Type.Empty;
			dagobah.sectors[4 * 10 + 5].type = state.world.sectors[4 * 10 + 5]?.type ?? Zone.Type.Empty;
			dagobah.sectors[5 * 10 + 4].type = state.world.sectors[5 * 10 + 4]?.type ?? Zone.Type.Empty;
			dagobah.sectors[5 * 10 + 5].type = state.world.sectors[5 * 10 + 5]?.type ?? Zone.Type.Empty;

			const spawn = this.determineYodaSpawnLocation(goal);
			switch (spawn) {
				case YodaSpawn.NorthWest:
				case YodaSpawn.SouthEast:
				case YodaSpawn.SouthWest:
					this.setupOutdoorSpawn(spawn, item, dagobah);
					break;
				case YodaSpawn.Hut:
					this._setupIndoorSpawn(dagobah, item, Yoda.tileIDs.Yoda);
					break;
				case YodaSpawn.None:
					this._setupIndoorSpawn(dagobah, item, Yoda.tileIDs.YodasSeat);
					break;
			}

			return dagobah;
		} finally {
			this.state = null;
		}
	}

	private determineYodaSpawnLocation = (goal: Puzzle) => {
		const spawn = randmod(4);

		if (goal === this.assets.get(Puzzle, Yoda.goalIDs.IMPERIAL_BATTLE_CODE)) {
			return YodaSpawn.SouthWest;
		}

		if (goal === this.assets.get(Puzzle, Yoda.goalIDs.RESCUE_YODA)) {
			return YodaSpawn.None;
		}

		return spawn;
	};

	private setupOutdoorSpawn(spawn: YodaSpawn, tile: Tile, dagobah: SavedWorld) {
		const npcID = Yoda.tileIDs.Yoda;
		const places = [
			[4, 4],
			[-1, -1],
			[5, 5],
			[4, 5]
		];
		const [x, y] = places[spawn];
		const place = dagobah.sectors[y * 10 + x];
		place.npc = this.assets.get(Tile, npcID)?.id ?? -1;
		place.findItem = tile?.id ?? -1;

		place.type = Zone.Type.Trade;

		const zone = this.assets.get(Zone, place.zone);
		console.assert(!!zone.npcs.find(i => i.id === npcID));
		const candidates = zone.hotspots.withType(Hotspot.Type.SpawnLocation);
		console.assert(candidates.length === 1);
		const hotspotIdx = randmod(candidates.length);
		const idx = candidates[hotspotIdx].id;
		const hotspot = this.state.hotspots.get(zone.id)[idx];
		if (!hotspot) {
			console.warn("Could not find npc hotspot on daboah hut!");
			return;
		}

		hotspot.argument = npcID;
		hotspot.enabled = true;
	}

	private _setupIndoorSpawn(dagobah: SavedWorld, tile: Tile, npcID: number) {
		const zoneID = Yoda.zoneIDs.YodasHut;
		const zone = this.assets.get(Zone, zoneID);
		const place = dagobah.sectors[4 * 10 + 5];
		place.npc = this.assets.get(Tile, npcID)?.id ?? -1;
		place.findItem = tile?.id ?? -1;

		let hotspotFilter: (hotspot: SavedHotspot) => boolean;
		if (npcID === Yoda.tileIDs.Yoda) {
			hotspotFilter = ({ x, y }: SavedHotspot) => x === 3 && y === 3;
		} else {
			hotspotFilter = ({ x, y }: SavedHotspot) => x === 3 && y === 2;
		}

		const hotspots = this.state.hotspots.get(zone.id);
		const hotspot = hotspots.find(hotspotFilter);
		if (!hotspot) {
			console.warn("Could not find npc hotspot in yoda's hut!");
			return;
		}

		hotspot.argument = npcID;
		hotspot.enabled = true;
	}
}

export default DagobahGenerator;
