import { add } from "/util";

export default class {
	constructor(data) {
		this._data = data;
	}

	get requiredSize() {
		return 1024 * 1024 * 5;
	}

	writeTo(stream) {
		stream.writeCharacters('VERS');
		stream.writeUint32(512);

		stream.writeCharacters('STUP');
		stream.writeUint32(288 * 288);
		stream.writeUint8Array(this._data._rawInput.STUP.pixelData);

		const sounds = this._data.sounds;
		stream.writeCharacters('SNDS');
		stream.writeUint32(2 + sounds.length * 3 + sounds.map(snd => snd.length).reduce(add, 0));
		stream.writeInt16(-sounds.length);
		sounds.forEach(snd => stream.writeLengthPrefixedNullTerminatedString(snd));

		const tiles = this._data.tiles;
		stream.writeCharacters('TILE');
		stream.writeUint32(tiles.length * (4 + 32 * 32));
		tiles.forEach((tile) => {
			stream.writeUint32(tile.attributes);
			stream.writeUint8Array(tile.pixelData);
		});

		const zones = this._data.zones;
		stream.writeCharacters('ZONE');
		stream.writeUint16(zones.length);
		zones.forEach(zone => this._writeZone(zone, stream));

		const puzzles = this._data.puzzles;
		stream.writeCharacters('PUZ2');
		stream.writeUint32(this._calculatePuzzlesSize(puzzles));
		puzzles.forEach((p, idx) => {
			stream.writeUint16(idx);
			this._writePuzzle(p, stream);
		});
		stream.writeInt16(-1);

		const characters = this._data.characters;
		stream.writeCharacters('CHAR');
		stream.writeUint32(2 + characters.length * (2 + 4 + 4) + characters.map(c => c.rawData.length).reduce(add, 0));
		characters.forEach((char, idx) => {
			stream.writeUint16(idx);
			stream.writeCharacters('ICHA');
			stream.writeUint32(char.rawData.length);
			stream.writeUint8Array(char.rawData);

		});
		stream.writeInt16(-1);

		stream.writeCharacters('CHWP');
		stream.writeUint32((2 + 4) * characters.length + 2);
		characters.forEach((char, idx) => {
			stream.writeUint16(idx);
			char.rawWeaponData.forEach(d => stream.writeUint8(d));
		});
		stream.writeInt16(-1);

		stream.writeCharacters('CAUX');
		stream.writeUint32((2 + 2) * characters.length + 2);
		characters.forEach((char, idx) => {
			stream.writeUint16(idx);
			char.rawAuxData.forEach(d => stream.writeUint8(d));
		});
		stream.writeInt16(-1);

		const namedTiles = tiles.filter(t => t.name);
		stream.writeCharacters('TNAM');
		stream.writeUint32(2 + namedTiles.length * (0x18 + 2));
		namedTiles.forEach(t => {
			stream.writeUint16(t.id);
			stream.writeCharacters(t.name);
			const padding = 0x18 - t.name.length;
			padding.times(() => stream.writeUint8(0));
		});
		stream.writeInt16(-1);

		stream.writeCharacters('ENDF');
		stream.writeUint32(0);
	}

	_writeZone(zone, stream) {
		stream.writeUint16(zone.planet);
		stream.writeUint32(this._calculateZoneSize(zone) + 4);
		stream.writeUint16(zone.id);
		stream.writeCharacters('IZON');
		stream.writeUint32(2 + // width
			2 + // height	
			4 + // type
			2 + // padding
			2 + // planet
			2 * zone.height * zone.width * zone.LAYERS -
			8 +
			0x10
		);
		stream.writeUint16(zone.width);
		stream.writeUint16(zone.height);
		stream.writeUint32(zone.type);
		stream.writeInt16(-1); // paddingq
		stream.writeUint16(zone.planet);

		zone.height.times(
			y => zone.width.times(
				x => zone.LAYERS.times(
					z => stream.writeInt16(zone.getTileID(x, y, z)))));

		stream.writeUint16(zone.hotspots.length);
		zone.hotspots.forEach(htsp => this._writeHotspot(htsp, stream));

		const npcs = zone.npcs;
		const requiredItemIDs = zone.requiredItemIDs;
		const assignedItemIDs = zone.assignedItemIDs;
		stream.writeCharacters('IZAX');
		stream.writeUint32(8 +
			2 +
			2 + npcs.length * 44 +
			2 + requiredItemIDs.length * 2 +
			2 + assignedItemIDs.length * 2
		);
		stream.writeUint16(zone.izaxUnknown);
		stream.writeUint16(npcs.length);
		npcs.forEach(npc => this._writeNPC(npc, stream));
		stream.writeUint16(requiredItemIDs.length);
		requiredItemIDs.forEach(item => stream.writeUint16(item));
		stream.writeUint16(assignedItemIDs.length);
		assignedItemIDs.forEach(item => stream.writeUint16(item));

		const providedItemIDs = zone.providedItemIDs;
		stream.writeCharacters('IZX2');
		stream.writeUint32(4 + 4 + providedItemIDs.length * 2 + 2);
		stream.writeUint16(providedItemIDs.length);
		providedItemIDs.forEach(item => stream.writeUint16(item));

		const puzzleNPCTileIDs = zone.puzzleNPCTileIDs;
		stream.writeCharacters('IZX3');
		stream.writeUint32(4 + 4 + 2 + puzzleNPCTileIDs.length * 2);
		stream.writeUint16(puzzleNPCTileIDs.length);
		puzzleNPCTileIDs.forEach(npc => stream.writeUint16(npc));

		stream.writeCharacters('IZX4');
		stream.writeUint32(2);
		stream.writeUint16(zone.izx4Unknown);

		stream.writeUint16(zone.actions.length);
		zone.actions.forEach(action => this._writeAction(action, stream));
	}

	_writeNPC(npc, stream) {
		stream.writeUint16(npc.face);
		stream.writeUint16(npc.x);
		stream.writeUint16(npc.y);
		stream.writeUint16(npc.unknown1);
		stream.writeUint32(npc.unknown2);
		stream.writeUint8Array(npc.unknown3);
	}

	_calculateZoneSize(zone) {
		return 2 + // width
			2 + // height	
			4 + // type
			2 + // padding
			2 + // planet
			2 * zone.height * zone.width * zone.LAYERS +
			// hotspots
			2 + zone.hotspots.length * 12 +
			// izax
			4 + 4 + 2 +
			0 + 2 + zone.npcs.length * 44 + // npcs
			2 + 2 * zone.requiredItemIDs.length +
			2 + 2 * zone.assignedItemIDs.length +
			// izx2
			4 + // marker
			4 + // size
			2 + 2 * zone.providedItemIDs.length +
			// izx3
			4 + // marker
			4 + // size
			2 + 2 * zone.puzzleNPCTileIDs.length +
			// izx4
			4 + // marker
			4 + // size
			2 + // unknown
			// ations
			4 + 4 + zone.actions.map(this._calculateActionSize).reduce(add, 0);
	}

	_writeHotspot(hotspot, stream) {
		stream.writeUint32(hotspot.type);
		stream.writeUint16(hotspot.x);
		stream.writeUint16(hotspot.y);
		stream.writeUint16(1); // enabled
		stream.writeUint16(hotspot.arg);
	}

	_writeAction(action, stream) {
		const writeActionItem = item => {
			stream.writeUint16(item.opcode);
			item.arguments.forEach(arg => stream.writeUint16(arg));
			stream.writeLengthPrefixedString(item.text);
		};
		const calculateActionItemSize = item => 2 + item.arguments.length * 2 + item.text.length + 2;

		const conditionsSize = action.conditions.map(calculateActionItemSize).reduce(add, 0);
		const instructionsSize = action.instructions.map(calculateActionItemSize).reduce(add, 0);
		stream.writeCharacters('IACT');
		stream.writeUint32(2 + conditionsSize + 2 + instructionsSize);
		stream.writeUint16(action.conditions.length);
		action.conditions.forEach(writeActionItem);
		stream.writeUint16(action.instructions.length);
		action.instructions.forEach(writeActionItem);
	}

	_calculateActionSize(action) {
		const calculateActionItemSize = item => 2 + item.arguments.length * 2 + item.text.length + 2;
		const conditionsSize = action.conditions.map(calculateActionItemSize).reduce(add, 0);
		const instructionsSize = action.instructions.map(calculateActionItemSize).reduce(add, 0);

		return 4 + 4 + 2 + conditionsSize + 2 + instructionsSize;
	}

	_writePuzzle(puzzle, stream) {
		stream.writeCharacters('IPUZ');
		stream.writeUint32(this._calculatePuzzleSize(puzzle));

		if (puzzle.id === 0xBD || puzzle.id === 0xC5) {
			stream.writeUint32(3);
		} else stream.writeUint32(puzzle.type);

		stream.writeUint32(puzzle._unknown1);
		stream.writeUint32(puzzle._unknown2);
		stream.writeUint16(puzzle._unknown3);
		puzzle.strings.forEach(string => stream.writeLengthPrefixedString(string));

		stream.writeInt16(puzzle.item_1);
		stream.writeInt16(puzzle.item_2 ? puzzle.item_2 : 0);
	}

	_calculatePuzzlesSize(puzzles) {
		return 2 + puzzles.length * (2 + 4 + 4) + puzzles.map(this._calculatePuzzleSize).reduce(add, 0);
	}

	_calculatePuzzleSize(puzzle) {
		const textSize = puzzle.strings.map(str => str.length + 1).reduce(add, 0);
		return 4 + 4 + 4 + 4 + 4 + 2 + textSize + 2 + 2 - 3;
	}
}
