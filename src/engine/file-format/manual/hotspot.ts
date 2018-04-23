import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";

export const parseHotspot = (stream: InputStream, data: RawData) => {
	let type = stream.getUint32();
	let x = stream.getInt16();
	let y = stream.getInt16();
	let enabled = stream.getUint16() != 0;
	let argument = stream.getInt16();
};

export const parseHotspots = (stream: InputStream, data: RawData) => {
	let count = stream.getUint32();
	do {
		let zoneId = stream.getInt16();
		if (zoneId === -1) {
			break;
		}

		let count = stream.getUint16();
		for (let i = 0; i < count; i++) {
			parseHotspot(stream, data);
		}
	} while (true);
};
