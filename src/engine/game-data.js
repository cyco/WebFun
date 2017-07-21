import { Tile, Puzzle, Zone, Hotspot, Action, Instruction, Condition, NPC, Char, CharFrame } from "./objects";
import { HotspotType, PuzzleType } from "./objects";

export default class {
	constructor(raw) {
		this._rawInput = raw;
		this._version = this._getCategory('VERS').version;
		this._sounds = this._getCategory('SNDS').sounds.map((i) => i.content);
		this._tiles = this._getCategory('TILE').tiles.map((t, i) => new Tile(i, t.attributes, t.pixels));
		this._puzzles = this._getCategory('PUZ2').puzzles.map((data, index) => this._makePuzzle(data, index));
		this._zones = this._getCategory('ZONE').zones.map((data, index) => this._makeZone(data, index));
		this._characters = this._getCategory('CHAR').characters.map((data, index) => this._makeCharacter(data, index));

		this._getCategory('CAUX').auxiliaries.forEach(({data}, idx) => this._characters[idx].rawAuxData = data);
		this._getCategory('CHWP').weapons.forEach(({data}, idx) => this._characters[idx].rawWeaponData = data);
		this._getCategory('TNAM').names.forEach((obj, idx) => obj.name && (this._tiles[obj.tileId]._name = obj.name));
	}

	_getCategory(category) {
		const catalogEntry = this._rawInput.catalog.find(c => c.type === category);
		if (!catalogEntry) throw `Category ${category} not found in game file!`;

		return catalogEntry.content;
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
		zone.assignedItemIDs = data.izax.assignedItems;
		zone.requiredItemIDs = data.izax.requiredItems;
		zone.providedItemIDs = data.izx2.providedItems;
		zone.puzzleNPCTileIDs = data.izx3.puzzleNpc;
		zone.izaxUnknown = data.izax.count1;
		zone.izx4Unknown = data.izx4.unknown;

		zone._actions = data.actions.map((data, i) => this._makeAction(data, i));
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

	_makeAction(data, idx) {
		const action = new Action();

		action._id = idx;
		action._conditions = data.conditions.map((data) => new Condition(data));
		action._instructions = data.instructions.map((data) => new Instruction(data));

		return action;
	}

	_makeCharacter(data, idx) {
		const char = new Char();
		char._id = idx;
		char._name = data.name;
		char._frames.push(new CharFrame(data.frame1));
		char._frames.push(new CharFrame(data.frame2));
		char._frames.push(new CharFrame(data.frame3));

		return char;
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

	get characters() {
		return this._characters;
	}
}
