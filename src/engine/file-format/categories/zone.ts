import { Indy, Yoda, YodaDemo, IndyDemo } from "src/variant";
import Variant from "src/engine/variant";

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

const parseZone = (stream: InputStream, data: Data, variant: Variant): Zone => {
	let planet = 0;
	if (variant === Yoda || variant === YodaDemo) {
		planet = stream.readUint16();
		// skip over size
		stream.readUint32();
		// skip over zone index
		stream.readUint16();
	}

	const marker = stream.readCharacters(4);
	assert(marker === IZON, `Expected to find category ${IZON}.`, stream);

	// skip over size
	stream.readUint32();
	const width = stream.readUint16();
	const height = stream.readUint16();
	const zoneType = stream.readUint32();
	if (variant === Yoda || variant === YodaDemo) {
		// skip over sectorCounter value
		stream.readUint16();

		const planetAgain = stream.readUint16();
		assert(planet === planetAgain, "Expected to find the same planet again", stream);
	}

	const tileIDs = stream.readInt16Array(3 * width * height);
	if (variant === Indy || variant === IndyDemo) {
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

	const hotspotCount = stream.readUint16();
	const hotspots = [];
	for (let i = 0; i < hotspotCount; i++) {
		hotspots.push(parseHotspot(stream));
	}

	const { monsters, requiredItemIDs, goalItemIDs } = parseZoneAux(stream, data);
	const { providedItemIDs } = parseZoneAux2(stream, data);
	const { npcIDs } = parseZoneAux3(stream, data);
	const { unknown } = parseZoneAux4(stream, data);

	const actionCount = stream.readUint16();
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

export const parseZones = (stream: InputStream, data: Data, variant: Variant): void => {
	let count = stream.readUint16();
	if (variant === Indy || variant === IndyDemo) {
		// skip over unknown value
		stream.readUint16();
		count = stream.readUint16();
	}

	const zones = [];
	for (let i = 0; i < count; i++) {
		zones.push(parseZone(stream, data, variant));
	}
	data.zones = zones;
};

const parseZoneAux = (stream: InputStream, _: Data): any => {
	const marker = stream.readCharacters(4);
	assert(marker === IZAX, `Expected to find category ${IZAX}.`, stream);
	// skip over size
	stream.readUint32();
	// skip over unknown value
	stream.readUint16();

	const monsterCount = stream.readUint16();
	const monsters = [];
	for (let i = 0; i < monsterCount; i++) {
		monsters.push(parseMonster(stream));
	}

	const requiredItemCount = stream.readUint16();
	const requiredItemIDs = stream.readInt16Array(requiredItemCount);

	const goalItemCount = stream.readUint16();
	const goalItemIDs = stream.readInt16Array(goalItemCount);

	return { monsters, requiredItemIDs, goalItemIDs };
};

const parseZoneAux2 = (stream: InputStream, _: Data): any => {
	const marker = stream.readCharacters(4);
	assert(marker === IZX2, `Expected to find category ${IZX2}.`, stream);
	// skip over size
	stream.readUint32();

	const providedItemCount = stream.readUint16();
	const providedItemIDs = stream.readUint16Array(providedItemCount);

	return { providedItemIDs };
};

const parseZoneAux3 = (stream: InputStream, _: Data): any => {
	const marker = stream.readCharacters(4);
	assert(marker === IZX3, `Expected to find category ${IZX3}.`, stream);
	// skip over size
	stream.readUint32();

	const npcCount = stream.readUint16();
	const npcIDs = stream.readUint16Array(npcCount);

	return { npcIDs };
};

const parseZoneAux4 = (stream: InputStream, _: Data): any => {
	const marker = stream.readCharacters(4);
	assert(marker === IZX4, `Expected to find category ${IZX4}.`, stream);
	// skip over size
	stream.readUint32();

	const unknown = stream.readUint16();
	return { unknown };
};

export const parseZoneNames = (stream: InputStream, data: Data): void => {
	// skip over size
	stream.readUint32();

	do {
		const zoneID = stream.readInt16();
		if (zoneID === -1) {
			break;
		}

		data.zones[zoneID].name = stream.readCStringWithLength(0x10, "iso-8859-2");
	} while (true);
};

export const parseZaux = (stream: InputStream): void => {
	const size = stream.readUint32();
	stream.readUint8Array(size);
	// TODO: use aux data
};

export const parseZax2 = (stream: InputStream): void => {
	const size = stream.readUint32();
	stream.readUint8Array(size);
	// TODO: use aux data
};

export const parseZax3 = (stream: InputStream): void => {
	const size = stream.readUint32();
	stream.readUint8Array(size);
	// TODO: use aux data
};

export const parseZax4 = (stream: InputStream): void => {
	const size = stream.readUint32();
	stream.readUint8Array(size);
	// TODO: use aux data
};
