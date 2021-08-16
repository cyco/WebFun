import { Story, AssetManager, Variant } from "src/engine";
import { Tile, Zone, Hotspot, Puzzle } from "src/engine/objects";

import World from "src/engine/world";
import { srand, randmod } from "src/util";
import RoomIterator from "src/engine/room-iterator";
import { Yoda } from "src/variant";
import { WorldSize } from "src/engine/generation";

class SimulatedStory extends Story {
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
		srand(0);

		this._buildWorld(mainZone, surroundingZones, assets);
		this._buildPuzzle(mainZone, find, npc, required, required2);
		this._initializeZone(mainZone, find, npc, required, required2);
	}

	private _buildPuzzle(_: Zone, find: Tile, npc: Tile, required: Tile, required2: Tile) {
		const item = this.world.at(4, 4);
		item.findItem = find;
		item.npc = npc;
		item.requiredItem = required;
		item.additionalRequiredItem = required2;
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

	private _initializeZone(zone: Zone, find: Tile, _npc: Tile, _required: Tile, _required2: Tile) {
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
				// this.dropNPCAtHotspotRandomly(zone, npc);
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
			}
		}

		this.world = copy;
		this.dagobah = copy;

		this.goal = this.assets.get(Puzzle, 0);
	}
}

export default SimulatedStory;
