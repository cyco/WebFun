import { Story, AssetManager, Variant } from "src/engine";
import { Tile, Zone, Hotspot, Puzzle } from "src/engine/objects";

import RoomIterator from "src/engine/room-iterator";
import World from "src/engine/world";
import { WorldSize } from "src/engine/generation";
import { Yoda } from "src/variant";
import { randmod, srand } from "src/util";

class SimulatedStory extends Story {
	private config: any;

	constructor(
		find: Tile,
		npc: Tile,
		required: Tile,
		required2: Tile,
		mainZone: Zone,
		surroundingZones: Zone[],
		assets: AssetManager,
		variant: Variant = Yoda
	) {
		super(assets, variant);

		this.config = { find, npc, required, required2, mainZone, surroundingZones };
	}

	private _buildWorld(zone: Zone, surroundingZones: Zone[], assets: AssetManager) {
		const world = new World(assets);
		world.at(4, 4).zone = zone;
		world.at(3, 3).zone = surroundingZones[0];
		world.at(4, 3).zone = surroundingZones[1];
		world.at(5, 3).zone = surroundingZones[2];
		world.at(3, 4).zone = surroundingZones[3];
		world.at(5, 4).zone = surroundingZones[4];
		world.at(3, 5).zone = surroundingZones[5];
		world.at(4, 5).zone = surroundingZones[6];
		world.at(5, 5).zone = surroundingZones[7];

		this.world = world;
		this.dagobah = new World(assets);
	}

	private _setupSector(_: Zone, find: Tile, npc: Tile, required: Tile, required2: Tile) {
		const item = this.world.at(4, 4);
		item.findItem = find;
		item.npc = npc;
		item.requiredItem = required;
		item.additionalRequiredItem = required2;
		item.puzzleIndex = 0;
		item.usedAlternateStrain = true;
	}

	private _buildPuzzles(zone: Zone, find: Tile, required: Tile) {
		switch (zone.type) {
			case Zone.Type.Trade:
				const p1candidates = this.assets.getFiltered(
					Puzzle,
					p => p.type === Puzzle.Type.Transaction && p.item1 === find
				);
				const p2candidates = this.assets.getFiltered(
					Puzzle,
					p => p.type === Puzzle.Type.Transaction && p.item1 === required
				);

				this.puzzles = [
					[p1candidates[randmod(p1candidates.length)], p2candidates[randmod(p2candidates.length)]],
					[]
				];
				return;
			default:
				return;
		}
	}

	private _initializeZone(zone: Zone, find: Tile, npc: Tile, required: Tile, required2: Tile) {
		switch (zone.type) {
			case Zone.Type.BlockadeNorth:
			case Zone.Type.BlockadeSouth:
			case Zone.Type.BlockadeEast:
			case Zone.Type.BlockadeWest:
			case Zone.Type.TravelStart:
			case Zone.Type.TravelEnd:
				break;
			case Zone.Type.Goal:
			/*
			const npc = this.findUnusedNPCForZoneRandomly(zone);
			const hasNPC = npc !== null ? this.zoneLeadsToNPC(zone, npc) : 0;
			if(!hasNPC) {
				this.placeQuestItem(zone, puzzle3.item1);
				this.placeQuestItem(zone, puzzle3.item2 ? puzzle3.item2 : null)
			}
			*/
			case Zone.Type.Use:
				// if(this.dropItemAtLockHotspot(zone, p1.item1)) {
				// 	this.placeQuestItem(zone, p2.item1)
				// }
				break;
			case Zone.Type.Trade:
				for (const room of RoomIterator(zone, this.assets)) {
					if (!room.npcs.includes(npc)) continue;

					const candidates = room.hotspots.withType(Hotspot.Type.SpawnLocation);
					if (!candidates.length) continue;

					const hotspot = candidates[randmod(candidates.length)];
					hotspot.enabled = true;
					hotspot.argument = npc.id;
					break;
				}
				break;
			case Zone.Type.Find:
			case Zone.Type.FindUniqueWeapon:
				const hotspotTypeForTile = (input: Tile) => {
					if (input.hasAttributes(Tile.Attributes.Weapon)) {
						return Hotspot.Type.DropUniqueWeapon;
					} else if (input.hasAttributes(Tile.Attributes.Map)) {
						return Hotspot.Type.DropMap;
					} else if (input.hasAttributes(Tile.Attributes.Item)) {
						return Hotspot.Type.DropQuestItem;
					}
				};
				const type = hotspotTypeForTile(find);
				for (const room of RoomIterator(zone, this.assets)) {
					const candidates = room.hotspots.withType(type);
					if (!candidates.length) continue;
					const hotspot = candidates[randmod(candidates.length)];
					hotspot.enabled = true;
					hotspot.argument = find.id;
					break;
				}
				break;
			case Zone.Type.Town:
			case Zone.Type.Empty:
			default:
				break;
		}
	}

	public generate(seed: number, planet: Zone.Planet, size: WorldSize): void {
		this.seed = seed;
		this.planet = planet;
		this.size = size;

		srand(seed);

		this._buildWorld(this.config.mainZone, this.config.surroundingZones, this.config.assets);
		this._setupSector(
			this.config.mainZone,
			this.config.find,
			this.config.npc,
			this.config.required,
			this.config.required2
		);
		this._buildPuzzles(this.config.mainZone, this.config.find, this.config.required);
		this._initializeZone(
			this.config.mainZone,
			this.config.find,
			this.config.npc,
			this.config.required,
			this.config.required2
		);

		const copy = new World(this.assets);

		const mapItem = (i: Tile) => i && this.assets.get(Tile, i.id);
		const mapZone = (z: Zone) => z && this.assets.get(Zone, z.id);

		for (let y = 0; y < World.Size.height; y++) {
			for (let x = 0; x < World.Size.width; x++) {
				const item = this.world.at(x, y);
				const copiedItem = copy.at(x, y);

				copiedItem.zone = mapZone(item.zone);
				copiedItem.zoneType = item.zoneType;
				copiedItem.puzzleIndex = item.puzzleIndex;
				copiedItem.requiredItem = mapItem(item.requiredItem);
				copiedItem.additionalRequiredItem = mapItem(item.additionalRequiredItem);
				copiedItem.npc = mapItem(item.npc);
				copiedItem.findItem = mapItem(item.findItem);
				copiedItem.usedAlternateStrain = item.usedAlternateStrain;
			}
		}

		this.world = copy;
		this.dagobah = new World(this.assets);

		this.goal = this.assets.get(Puzzle, 0);
	}
}

export default SimulatedStory;
