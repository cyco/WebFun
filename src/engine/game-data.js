import { Tile, Puzzle, Zone, Hotspot, Action, Instruction, Condition, NPC } from "./objects";
import { Type as HotspotType } from "./objects/hotspot";
import { Type as PuzzleType } from "./objects/puzzle";

export default class {
	constructor(raw) {
		this._rawInput = raw;
		this._version = raw.VERS.version;
		this._sounds = raw.SNDS.items.map((i) => i.name);
		this._tiles = raw.TILE.tiles.map((t, i) => new Tile(i, t.attributes, t.pixelData));
		this._puzzles = raw.PUZ2.puzzles.map((data, index) => this._makePuzzle(data, index));
		this._zones = raw.ZONE.map((data, index) => this._makeZone(data, index));
	}

	_makePuzzle(data, index) {
		const puzzle = new Puzzle();

		puzzle.id = index;
		puzzle._type = data.type;
		puzzle._unknown1 = data.unknown1;
		puzzle._unknown2 = data.unknown2;
		puzzle._unknown3 = data.unknown3;

		puzzle._strings = data.strings;
		puzzle._itemIDs = [data.item1, data.item2];
		puzzle.item_1 = data.item1;
		puzzle.item_2 = data.item2;

		if (index === 0xBD || index === 0xC5)
			puzzle._type = PuzzleType.Disabled;

		return puzzle;
	}

	_makeZone(data) {
		const zone = new Zone();

		zone.id = data.index;
		zone._planet = data.planet;
		zone._width = data.width;
		zone._height = data.width;
		zone._type = data.type;
		zone._tileIDs = data.tileIds;
		zone._hotspots = data.hotspots.map((d) => this._makeHotspot(d));
		zone._npcs = data.izax.npcs.map((d) => new NPC(d));
		zone.assignedItemIDs = data.izax.assignedItemIds;
		zone.requiredItemIDs = data.izax.requiredItemIds;
		zone.providedItemIDs = data.izx2.providedItemIds;
		zone.puzzleNPCTileIDs = data.izx3.npcTileIds;

		zone._actions = data.actions.map((data) => this._makeAction(data));
		zone._tileStore = this.tiles;

		return zone;
	}

	_makeHotspot(data) {
		const hotspot = new Hotspot();
		hotspot._x = data.x;
		hotspot._y = data.y;

		hotspot.enabled = !!data.enabled;
		hotspot.arg = data.arg;
		hotspot.type = data.type;

		switch (hotspot.type) {
			case HotspotType.TriggerLocation:
			case HotspotType.SpawnLocation:
			case HotspotType.ForceLocation:
			case HotspotType.LocatorThingy:
				hotspot.enabled = false;
				break;
			case HotspotType.VehicleTo:
			case HotspotType.VehicleBack:
			case HotspotType.DoorIn:
			case HotspotType.Lock:
			case HotspotType.xWingFromD:
			case HotspotType.xWingToD:
			case HotspotType.CrateItem:
			case HotspotType.PuzzleNPC:
			case HotspotType.CrateWeapon:
				hotspot.enabled = true;
				break;
			default:
				hotspot.arg = -1;
				hotspot.enabled = true;
				break;
		}

		return hotspot;
	}

	_makeAction(data) {
		const action = new Action();

		action._conditions = data.conditions.map((data) => new Condition(data));
		action._instructions = data.instructions.map((data) => new Instruction(data));

		return action;
	}

	get version() {
		return this._version;
	}

	get sounds() {
		return this._sounds;
	}

	get tiles() {
		return this._tiles;
	}

	get puzzles() {
		return this._puzzles;
	}

	get zones() {
		return this._zones;
	}
}
