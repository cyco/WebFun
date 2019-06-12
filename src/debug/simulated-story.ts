import { GameData, Story } from "src/engine";
import { Tile, Zone, ZoneType, Hotspot } from "src/engine/objects";

import { World } from "src/engine/generation";
import { WorldSize } from "src/engine/types";
import { srand, randmod } from "src/util";
import RoomIterator from "src/engine/room-iterator";
import * as Type from "src/engine/types";

class SimulatedStory extends Story {
	private readonly allZones: Zone[];
	constructor(
		find: Tile,
		npc: Tile,
		required: Tile,
		required2: Tile,
		mainZone: Zone,
		surroundingZones: Zone[],
		allZones: Zone[]
	) {
		super(0, mainZone.planet, WorldSize.Small);
		srand(0);

		this.allZones = allZones;
		this._buildWorld(mainZone, surroundingZones);
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

	private _buildWorld(zone: Zone, surroundingZones: Zone[]) {
		const world = new World();
		world.setZone(4, 4, zone);
		world.setZone(3, 3, surroundingZones[0]);
		world.setZone(4, 3, surroundingZones[1]);
		world.setZone(5, 3, surroundingZones[2]);
		world.setZone(3, 4, surroundingZones[3]);
		world.setZone(5, 4, surroundingZones[4]);
		world.setZone(3, 5, surroundingZones[5]);
		world.setZone(4, 5, surroundingZones[6]);
		world.setZone(5, 5, surroundingZones[7]);
		this._world = world;
		this._dagobah = world;
	}

	private _initializeZone(zone: Zone, find: Tile, _npc: Tile, _required: Tile, _required2: Tile) {
		switch (zone.type) {
			case ZoneType.BlockadeNorth:
			case ZoneType.BlockadeSouth:
			case ZoneType.BlockadeEast:
			case ZoneType.BlockadeWest:
			case ZoneType.TravelStart:
			case ZoneType.TravelEnd:
				break;
			case ZoneType.Goal:
			/*
			const npc = this.findUnusedNPCForZoneRandomly(zone);
			const hasPuzzleNPC = npc !== null ? this.zoneLeadsToNPC(zone, npc) : 0;
			if(!hasPuzzleNPC) {
				this.dropItemAtTriggerHotspotRandomly(zone, puzzle3.item1);
				this.dropItemAtTriggerHotspotRandomly(zone, puzzle3.item2 ? puzzle3.item2 : null)
			}
		*/
			case ZoneType.Trade:
				// if(this.dropItemAtLockHotspot(zone, p1.item1)) {
				// 	this.dropItemAtTriggerHotspotRandomly(zone, p2.item1)
				// }
				break;
			case ZoneType.Use:
				// this.dropNPCAtHotspotRandomly(zone, npc);
				break;
			case ZoneType.Find:
			case ZoneType.FindTheForce:
				const hotspotTypeForTileAttributes = (input: number) => {
					if ((input & Type.TILE_SPEC_THE_FORCE) !== 0) {
						return Hotspot.Type.ForceLocation;
					} else if ((input & Type.TILE_SPEC_MAP) !== 0) {
						return Hotspot.Type.LocatorThingy;
					} else if ((input & Type.TILE_SPEC_USEFUL) !== 0) {
						return Hotspot.Type.TriggerLocation;
					}
				};
				const type = hotspotTypeForTileAttributes(find.attributes);
				for (const room of RoomIterator(zone, this.allZones)) {
					const candidates = room.hotspots.withType(type);
					if (!candidates.length) continue;
					const hotspot = candidates[randmod(candidates.length)];
					hotspot.enabled = true;
					hotspot.arg = find.id;
					break;
				}
				break;
			case ZoneType.Town:
			case ZoneType.Empty:
			default:
				break;
		}
	}

	generateWorld(data: GameData): void {
		const copy = new World();

		const mapItem = (i: Tile) => i && data.tiles[i.id];
		const mapZone = (z: Zone) => z && data.zones[z.id];

		for (let y = 0; y < World.HEIGHT; y++) {
			for (let x = 0; x < World.WIDTH; x++) {
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
		copy.zones = this._world.zones.map(mapZone);

		this._world = copy;
		this._dagobah = copy;

		this.goal = data.puzzles.first();
		this._world.layDownHotspotItems();
	}

	set world(w) {
		this._world = w;
	}

	get world() {
		return this._world;
	}
}

export default SimulatedStory;
