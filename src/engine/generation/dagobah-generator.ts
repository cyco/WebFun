import AssetManager from "src/engine/asset-manager";
import { Tile, Zone, Hotspot, Puzzle } from "src/engine/objects";
import { Yoda } from "src/variant";
import { randmod } from "src/util";
import { SavedWorld } from "../save-game/save-state";

enum YodaSpawn {
	NorthWest = 0,
	Hut = 1,
	SouthEast = 2,
	SouthWest = 3,
	None = 4
}

class DagobahGenerator {
	private readonly assets: AssetManager;

	constructor(assets: AssetManager) {
		this.assets = assets;
	}

	public generate(goal: Puzzle, item: Tile): SavedWorld {
		const dagobah: SavedWorld = {
			sectors: (100).times(_ => ({
				visited: false,
				solved1: false,
				solved2: false,
				solved3: false,
				solved4: false,
				zone: -1,

				puzzleIndex: -1,
				usedAlternateStrain: false,
				isGoal: false,

				findItem: -1,
				requiredItem: -1,
				additionalGainItem: -1,
				additionalRequiredItem: -1,
				npc: -1,

				unknown: -1
			}))
		};

		dagobah.sectors[4 * 10 + 4].zone = Yoda.zoneIDs.DagobahNorthWest;
		dagobah.sectors[4 * 10 + 5].zone = Yoda.zoneIDs.DagobahNorthEast;
		dagobah.sectors[5 * 10 + 4].zone = Yoda.zoneIDs.DagobahSouthWest;
		dagobah.sectors[5 * 10 + 5].zone = Yoda.zoneIDs.DagobahSouthEast;

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

		const zone = this.assets.get(Zone, place.zone);
		console.assert(!!zone.npcs.find(i => i.id === npcID));
		const candidates = zone.hotspots.withType(Hotspot.Type.SpawnLocation);
		console.assert(candidates.length === 1);
		const hotspot = candidates[randmod(candidates.length)];
		if (!hotspot) {
			console.warn("Could not find npc hotspot on daboah hut!");
			return;
		}

		hotspot.arg = npcID;
		hotspot.enabled = true;
	}

	private _setupIndoorSpawn(dagobah: SavedWorld, tile: Tile, npcID: number) {
		const zoneID = Yoda.zoneIDs.YodasHut;
		const zone = this.assets.get(Zone, zoneID);
		const place = dagobah.sectors[4 * 10 + 5];
		place.npc = this.assets.get(Tile, npcID)?.id ?? -1;
		place.findItem = tile?.id ?? -1;

		let hotspotFilter: (hotspot: Hotspot) => boolean;
		if (npcID === Yoda.tileIDs.Yoda) {
			hotspotFilter = ({ x, y }: Hotspot) => x === 3 && y === 3;
		} else {
			hotspotFilter = ({ x, y }: Hotspot) => x === 3 && y === 2;
		}

		const hotspot = zone.hotspots.find(hotspotFilter);
		if (!hotspot) {
			console.warn("Could not find npc hotspot in yoda's hut!");
			return;
		}

		hotspot.arg = npcID;
		hotspot.enabled = true;
	}
}

export default DagobahGenerator;
