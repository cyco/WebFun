import { Story, AssetManager } from "src/engine";
import { Tile, Zone, Hotspot, Puzzle } from "src/engine/objects";

import World from "src/engine/world";
import { WorldSize } from "src/engine/types";
import { srand, randmod } from "src/util";
import RoomIterator from "src/engine/room-iterator";
import * as Type from "src/engine/types";

class SimulatedStory extends Story {
	private readonly assets: AssetManager;

	constructor(
		find: Tile,
		npc: Tile,
		required: Tile,
		required2: Tile,
		mainZone: Zone,
		surroundingZones: Zone[],
		assets: AssetManager
	) {
		super(0, mainZone.planet, WorldSize.Small);
		srand(0);

		this.assets = assets;
		this._buildWorld(mainZone, surroundingZones, assets);
		this._buildPuzzle(mainZone, find, npc, required, required2);
		this._initializeZone(mainZone, find, npc, required, required2);
	}

	private _buildPuzzle(_: Zone, find: Tile, npc: Tile, required: Tile, required2: Tile) {
		const item = this._world.at(4, 4);
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
		this._world = world;

		this._dagobah = new World(assets);
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
			case Zone.Type.Trade:
				// if(this.dropItemAtLockHotspot(zone, p1.item1)) {
				// 	this.placeQuestItem(zone, p2.item1)
				// }
				break;
			case Zone.Type.Use:
				// this.dropNPCAtHotspotRandomly(zone, npc);
				break;
			case Zone.Type.Find:
			case Zone.Type.FindUniqueWeapon:
				const hotspotTypeForTileAttributes = (input: number) => {
					if ((input & Tile.Attributes.Weapon) !== 0) {
						return Hotspot.Type.DropUniqueWeapon;
					} else if ((input & (1 << Tile.Subtype.Item.Locator)) !== 0) {
						return Hotspot.Type.DropMap;
					} else if ((input & Tile.Attributes.Item) !== 0) {
						return Hotspot.Type.DropQuestItem;
					}
				};
				const type = hotspotTypeForTileAttributes(find.attributes);
				for (const room of RoomIterator(zone, this.assets)) {
					const candidates = room.hotspots.withType(type);
					if (!candidates.length) continue;
					const hotspot = candidates[randmod(candidates.length)];
					hotspot.enabled = true;
					hotspot.arg = find.id;
					break;
				}
				break;
			case Zone.Type.Town:
			case Zone.Type.Empty:
			default:
				break;
		}
	}

	generateWorld(assets: AssetManager): void {
		const copy = new World(assets);

		const mapItem = (i: Tile) => i && assets.get(Tile, i.id);
		const mapZone = (z: Zone) => z && assets.get(Zone, z.id);

		for (let y = 0; y < World.Size.height; y++) {
			for (let x = 0; x < World.Size.width; x++) {
				const item = this._world.at(x, y);
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

		this._world = copy;
		this._dagobah = copy;

		this.goal = assets.get(Puzzle, 0);
	}

	set world(w) {
		this._world = w;
	}

	get world() {
		return this._world;
	}
}

export default SimulatedStory;
