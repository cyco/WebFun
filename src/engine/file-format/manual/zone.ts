import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";
import { assert } from "../error";
import { Tile } from "src/engine/objects";
import { parseHotspot } from "./hotspot";
import { parseAction } from "./action";
import { parseNPC } from "./npc";
import { GameType, Yoda, Indy } from "src/engine/type";

const IZON = "IZON";
const IZAX = "IZAX";
const IZX2 = "IZX2";
const IZX3 = "IZX3";
const IZX4 = "IZX4";

const parseZone = (stream: InputStream, data: RawData, gameType: GameType) => {
	let planet;
	if (gameType === Yoda) {
		planet = stream.getUint16();
		let size = stream.getUint32();
		let index = stream.getUint16();
	}

	let marker = stream.getCharacters(4);
	assert(marker === IZON, `Expected to find category ${IZON}.`, stream);

	let size = stream.getUint32();
	let width = stream.getUint16();
	let height = stream.getUint16();
	let zoneType = stream.getUint32();
	if (gameType === Yoda) {
		let padding = stream.getUint16();
		let planet_again = stream.getUint16();
		assert(planet == planet_again, "Expected to find the same planet again", stream);
	}

	let tileIDs = stream.getInt16Array(3 * width * height);
	if (gameType === Indy) {
		return;
	}

	let hotspotCount = stream.getUint16();
	let hotspots = [];
	for (let i = 0; i < hotspotCount; i++) {
		hotspots.push(parseHotspot(stream, data));
	}

	parseZoneAux(stream, data);
	parseZoneAux2(stream, data);
	parseZoneAux3(stream, data);
	parseZoneAux4(stream, data);

	let actionCount = stream.getUint16();
	let actions = [];
	for (let i = 0; i < actionCount; i++) {
		actions.push(parseAction(stream, data));
	}
};

export const parseZones = (stream: InputStream, data: RawData, gameType: GameType) => {
	let count = stream.getUint16();
	if (gameType === Indy) {
		let unknown = stream.getUint16();
		count = stream.getUint16();
	}

	for (let i = 0; i < count; i++) {
		parseZone(stream, data, gameType);
	}
};

const parseZoneAux = (stream: InputStream, data: RawData) => {
	let marker = stream.getCharacters(4);
	console.log("marker", marker);
	assert(marker === IZAX, `Expected to find category ${IZAX}.`, stream);
	let size = stream.getUint32();
	let unknownCount = stream.getUint16();

	let npcCount = stream.getUint16();
	let npcs = [];
	for (let i = 0; i < npcCount; i++) {
		npcs.push(parseNPC(stream, data));
	}

	let requiredItemCount = stream.getUint16();
	let requriedItemIDs = stream.getUint16Array(requiredItemCount);

	let goalItemCount = stream.getUint16();
	let goalItemIDs = stream.getUint16Array(goalItemCount);
};

const parseZoneAux2 = (stream: InputStream, data: RawData) => {
	let marker = stream.getCharacters(4);
	assert(marker === IZX2, `Expected to find category ${IZX2}.`, stream);
	let size = stream.getUint32();

	let providedItemCount = stream.getUint16();
	let providedItemIDs = stream.getUint16Array(providedItemCount);
};

const parseZoneAux3 = (stream: InputStream, data: RawData) => {
	let marker = stream.getCharacters(4);
	assert(marker === IZX3, `Expected to find category ${IZX3}.`, stream);
	let size = stream.getUint32();

	let puzzleNPCCount = stream.getUint16();
	let puzzleNPCIDs = stream.getUint16Array(puzzleNPCCount);
};

const parseZoneAux4 = (stream: InputStream, data: RawData) => {
	let marker = stream.getCharacters(4);
	assert(marker === IZX4, `Expected to find category ${IZX4}.`, stream);
	let size = stream.getUint32();

	let unknown = stream.getUint16();
};

export const parseZoneNames = (stream: InputStream) => {
	let size = stream.getUint32();
	let data = stream.getUint8Array(size);
};

export const parseZaux = (stream: InputStream) => {
	let size = stream.getUint32();
	let data = stream.getUint8Array(size);
};

export const parseZax2 = (stream: InputStream) => {
	let size = stream.getUint32();
	let data = stream.getUint8Array(size);
};

export const parseZax3 = (stream: InputStream) => {
	let size = stream.getUint32();
	let data = stream.getUint8Array(size);
};

export const parseZax4 = (stream: InputStream) => {
	let size = stream.getUint32();
	let data = stream.getUint8Array(size);
};
