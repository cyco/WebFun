import { Tile, Puzzle, Zone, Hotspot, Action, Instruction, Condition, NPC, Char, CharFrame } from "./objects";
import { HotspotType, PuzzleType } from "./objects";

export default class {
	constructor(raw) {
		this._rawInput = raw;
		this._version = raw.VERS.version;
		this._sounds = raw.SNDS.items.map((i) => i.name);
		this._tiles = raw.TILE.tiles.map((t, i) => new Tile(i, t.attributes, t.pixelData));
		this._puzzles = raw.PUZ2.puzzles.map((data, index) => this._makePuzzle(data, index));
		this._zones = raw.ZONE.map((data, index) => this._makeZone(data, index));
		this._characters = raw.CHAR.characters.map((data, index) => this._makeCharacter(data, index));

		raw.CAUX.auxData.forEach(({data}, idx) => this._characters[idx].rawAuxData = data);
		raw.CHWP.weaponData.forEach(({data}, idx) => this._characters[idx].rawWeaponData = data);
		raw.TNAM.tileNames.forEach((name, idx) => name && (this._tiles[idx]._name = name.trimCharacter("\0")));
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

	_makeCharacter({blob: data}, idx) {
		const frameSize = 8 * 2, frameCount = 3;
		
		const size = data.length;
		const nonFrameSize = size - frameCount * frameSize;
		const nonFrameData = data.slice(0, nonFrameSize);
		const nameEnd = nonFrameData.indexOf(0);
		const frameData = new Uint16Array(new Uint8Array(data.slice(nonFrameSize)).buffer);
		const char = new Char();
		char._id = idx;
		char._name = nonFrameData.slice(0, nameEnd).map(c => String.fromCharCode(c)).join('');
		const flags = nonFrameData.slice(nameEnd+1);
		// flags contain garbage
		// it is at least 6 bytes for indy, max 15 bytes
		// it is at least 10 bytes for yoda, max 21 bytes
		// common bytes are aligned the end
		char._data = flags.slice(-10);		
		for (let i = 0; i < frameCount; i++) {
			const thing = frameData.slice(i * frameSize / 2, (i + 1) * frameSize / 2);
			const frameTiles = Array.from(thing).map(id => this._tiles[id] || null);
			const frame = new CharFrame();
			frame._tiles = frameTiles;
			char._frames.push(frame);
		}
		char.rawData = data;

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
