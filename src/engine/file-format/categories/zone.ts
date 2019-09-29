import { GameType, Indy, Yoda } from "src/engine/type";

import { InputStream } from "src/util";
import { assert } from "../error";
import { parseAction } from "./action";
import { parseHotspot } from "./hotspot";
import { parseMonster } from "./monster";
import { Data, Zone, Hotspot, Action } from "../types";

const IZON = "IZON";
const IZAX = "IZAX";
const IZX2 = "IZX2";
const IZX3 = "IZX3";
const IZX4 = "IZX4";

const parseZone = (stream: InputStream, data: Data, gameType: GameType): Zone => {
	let planet = 0;
	if (gameType === Yoda) {
		planet = stream.getUint16();
		// skip over size
		stream.getUint32();
		// skip over zone index
		stream.getUint16();
	}

	const marker = stream.getCharacters(4);
	assert(marker === IZON, `Expected to find category ${IZON}.`, stream);

	// skip over size
	stream.getUint32();
	const width = stream.getUint16();
	const height = stream.getUint16();
	const zoneType = stream.getUint32();
	if (gameType === Yoda) {
		// skip over sharedCounter value
		stream.getUint16();

		const planetAgain = stream.getUint16();
		assert(planet === planetAgain, "Expected to find the same planet again", stream);
	}

	const tileIDs = stream.getInt16Array(3 * width * height);
	if (gameType === Indy) {
		return {
			planet,
			width,
			height,
			zoneType,
			tileIDs,
			hotspots: [] as Hotspot[],
			monsters: [] as any[],
			actions: [] as Action[],
			requiredItemIDs: new Int16Array(0),
			goalItemIDs: new Int16Array(0),
			providedItemIDs: new Int16Array(0),
			npcIDs: new Int16Array(0),
			unknown: 0
		};
	}

	const hotspotCount = stream.getUint16();
	const hotspots = [];
	for (let i = 0; i < hotspotCount; i++) {
		hotspots.push(parseHotspot(stream));
	}

	const { monsters, requiredItemIDs, goalItemIDs } = parseZoneAux(stream, data);
	const { providedItemIDs } = parseZoneAux2(stream, data);
	const { npcIDs } = parseZoneAux3(stream, data);
	const { unknown } = parseZoneAux4(stream, data);

	const actionCount = stream.getUint16();
	const actions = [];
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
		monsters,
		actions,
		requiredItemIDs,
		goalItemIDs,
		providedItemIDs,
		npcIDs,
		unknown
	};
};

export const parseZones = (stream: InputStream, data: Data, gameType: GameType): void => {
	let count = stream.getUint16();
	if (gameType === Indy) {
		// skip over unknown value
		stream.getUint16();
		count = stream.getUint16();
	}

	const zones = [];
	for (let i = 0; i < count; i++) {
		zones.push(parseZone(stream, data, gameType));
	}
	data.zones = zones;
};

const parseZoneAux = (stream: InputStream, _: Data): any => {
	const marker = stream.getCharacters(4);
	assert(marker === IZAX, `Expected to find category ${IZAX}.`, stream);
	// skip over size
	stream.getUint32();
	// skip over unknown value
	stream.getUint16();

	const monsterCount = stream.getUint16();
	const monsters = [];
	for (let i = 0; i < monsterCount; i++) {
		monsters.push(parseMonster(stream));
	}

	const requiredItemCount = stream.getUint16();
	const requiredItemIDs = stream.getInt16Array(requiredItemCount);

	const goalItemCount = stream.getUint16();
	const goalItemIDs = stream.getInt16Array(goalItemCount);

	return { monsters, requiredItemIDs, goalItemIDs };
};

const parseZoneAux2 = (stream: InputStream, _: Data): any => {
	const marker = stream.getCharacters(4);
	assert(marker === IZX2, `Expected to find category ${IZX2}.`, stream);
	// skip over size
	stream.getUint32();

	const providedItemCount = stream.getUint16();
	const providedItemIDs = stream.getUint16Array(providedItemCount);

	return { providedItemIDs };
};

const parseZoneAux3 = (stream: InputStream, _: Data): any => {
	const marker = stream.getCharacters(4);
	assert(marker === IZX3, `Expected to find category ${IZX3}.`, stream);
	// skip over size
	stream.getUint32();

	const npcCount = stream.getUint16();
	const npcIDs = stream.getUint16Array(npcCount);

	return { npcIDs };
};

const parseZoneAux4 = (stream: InputStream, _: Data): any => {
	const marker = stream.getCharacters(4);
	assert(marker === IZX4, `Expected to find category ${IZX4}.`, stream);
	// skip over size
	stream.getUint32();

	const unknown = stream.getUint16();
	return { unknown };
};

export const parseZoneNames = (stream: InputStream, data: Data): void => {
	// skip over size
	stream.getUint32();

	do {
		const zoneID = stream.getInt16();
		if (zoneID === -1) {
			break;
		}

		data.zones[zoneID].name = stream.getCStringWithLength(0x10, "iso-8859-2");
	} while (true);
};

export const parseZaux = (stream: InputStream): void => {
	const size = stream.getUint32();
	stream.getUint8Array(size);
	// TODO: use aux data
};

export const parseZax2 = (stream: InputStream): void => {
	const size = stream.getUint32();
	stream.getUint8Array(size);
	// TODO: use aux data
};

export const parseZax3 = (stream: InputStream): void => {
	const size = stream.getUint32();
	stream.getUint8Array(size);
	// TODO: use aux data
};

export const parseZax4 = (stream: InputStream): void => {
	const size = stream.getUint32();
	stream.getUint8Array(size);
	// TODO: use aux data
};
