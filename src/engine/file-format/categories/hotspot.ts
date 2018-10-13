import { InputStream } from "src/util";

export const parseHotspot = (stream: InputStream) => {
	let type = stream.getUint32();
	let x = stream.getInt16();
	let y = stream.getInt16();
	let enabled = stream.getUint16() != 0;
	let argument = stream.getInt16();

	return { type, x, y, enabled, argument };
};

export const parseHotspots = (stream: InputStream, data: any) => {
	// skip over count
	stream.getUint32();

	do {
		let zoneId = stream.getInt16();
		if (zoneId === -1) {
			break;
		}

		let count = stream.getUint16();
		let hotspots = [];
		for (let i = 0; i < count; i++) {
			hotspots.push(parseHotspot(stream));
		}
		data.zones[zoneId].hotspots = hotspots;
	} while (true);
};
