import { InputStream } from "src/util";
import { assert } from "../error";
import { parseHotspot } from "./hotspot";
import { parseAction } from "./action";
import { parseNPC } from "./npc";
import { GameType, Yoda, Indy } from "src/engine/type";

const IZON = "IZON";
const IZAX = "IZAX";
const IZX2 = "IZX2";
const IZX3 = "IZX3";
const IZX4 = "IZX4";

const parseZone = (stream: InputStream, data: any, gameType: GameType) => {
	let planet = 0;
	if (gameType === Yoda) {
		planet = stream.getUint16();
		// skip over size
		stream.getUint32();
		// skip over zone index
		stream.getUint16();
	}

	let marker = stream.getCharacters(4);
	assert(marker === IZON, `Expected to find category ${IZON}.`, stream);

	// skip over size
	stream.getUint32();
	let width = stream.getUint16();
	let height = stream.getUint16();
	let zoneType = stream.getUint32();
	if (gameType === Yoda) {
		// skip over padding value
		stream.getUint16();

		let planet_again = stream.getUint16();
		assert(planet == planet_again, "Expected to find the same planet again", stream);
	}

	let tileIDs = stream.getInt16Array(3 * width * height);
	if (gameType === Indy) {
		return {
			planet,
			width,
			height,
			zoneType,
			tileIDs,
			hotspots: [] as any[],
			npcs: [] as any[],
			actions: [] as any[],
			requiredItemIDs: new Int16Array(0),
			goalItemIDs: new Int16Array(0),
			providedItemIDs: new Int16Array(0),
			puzzleNPCIDs: new Int16Array(0),
			unknown: 0
		};
	}

	let hotspotCount = stream.getUint16();
	let hotspots = [];
	for (let i = 0; i < hotspotCount; i++) {
		hotspots.push(parseHotspot(stream));
	}

	const { npcs, requiredItemIDs, goalItemIDs } = parseZoneAux(stream, data);
	const { providedItemIDs } = parseZoneAux2(stream, data);
	const { puzzleNPCIDs } = parseZoneAux3(stream, data);
	const { unknown } = parseZoneAux4(stream, data);

	let actionCount = stream.getUint16();
	let actions = [];
	for (let i = 0; i < actionCount; i++) {
		actions.push(parseAction(stream, data));
	}

	return {
		planet,
		width,
		height,
		zoneType,
		tileIDs,
		hotspots,
		npcs,
		actions,
		requiredItemIDs,
		goalItemIDs,
		providedItemIDs,
		puzzleNPCIDs,
		unknown
	};
};

export const parseZones = (stream: InputStream, data: any, gameType: GameType) => {
	let count = stream.getUint16();
	if (gameType === Indy) {
		// skip over unknown value
		stream.getUint16();
		count = stream.getUint16();
	}

	let zones = [];
	for (let i = 0; i < count; i++) {
		zones.push(parseZone(stream, data, gameType));
	}
	data.zones = zones;
};

const parseZoneAux = (stream: InputStream, _: any): any => {
	let marker = stream.getCharacters(4);
	assert(marker === IZAX, `Expected to find category ${IZAX}.`, stream);
	// skip over size
	stream.getUint32();
	// skip over unknown value
	stream.getUint16();

	let npcCount = stream.getUint16();
	let npcs = [];
	for (let i = 0; i < npcCount; i++) {
		npcs.push(parseNPC(stream));
	}

	let requiredItemCount = stream.getUint16();
	let requiredItemIDs = stream.getInt16Array(requiredItemCount);

	let goalItemCount = stream.getUint16();
	let goalItemIDs = stream.getInt16Array(goalItemCount);

	return { npcs, requiredItemIDs, goalItemIDs };
};

const parseZoneAux2 = (stream: InputStream, _: any): any => {
	let marker = stream.getCharacters(4);
	assert(marker === IZX2, `Expected to find category ${IZX2}.`, stream);
	// skip over size
	stream.getUint32();

	let providedItemCount = stream.getUint16();
	let providedItemIDs = stream.getUint16Array(providedItemCount);

	return { providedItemIDs };
};

const parseZoneAux3 = (stream: InputStream, _: any): any => {
	let marker = stream.getCharacters(4);
	assert(marker === IZX3, `Expected to find category ${IZX3}.`, stream);
	// skip over size
	stream.getUint32();

	let puzzleNPCCount = stream.getUint16();
	let puzzleNPCIDs = stream.getUint16Array(puzzleNPCCount);

	return { puzzleNPCIDs };
};

const parseZoneAux4 = (stream: InputStream, _: any): any => {
	let marker = stream.getCharacters(4);
	assert(marker === IZX4, `Expected to find category ${IZX4}.`, stream);
	// skip over size
	stream.getUint32();

	let unknown = stream.getUint16();
	return { unknown };
};

export const parseZoneNames = (stream: InputStream, data: any) => {
	// skip over size
	stream.getUint32();

	do {
		let zoneID = stream.getInt16();
		if (zoneID === -1) {
			break;
		}

		data.zones[zoneID].name = stream.getCStringWithLength(0x10, "iso-8859-2");
	} while (true);
};

export const parseZaux = (stream: InputStream) => {
	let size = stream.getUint32();
	stream.getUint8Array(size);
	// TODO: use aux data
};

export const parseZax2 = (stream: InputStream) => {
	let size = stream.getUint32();
	stream.getUint8Array(size);
	// TODO: use aux data
};

export const parseZax3 = (stream: InputStream) => {
	let size = stream.getUint32();
	stream.getUint8Array(size);
	// TODO: use aux data
};

export const parseZax4 = (stream: InputStream) => {
	let size = stream.getUint32();
	stream.getUint8Array(size);
	// TODO: use aux data
};
