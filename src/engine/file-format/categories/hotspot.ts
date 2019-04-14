import { InputStream } from "src/util";

export const parseHotspot = (stream: InputStream) => {
	const type = stream.getUint32();
	const x = stream.getInt16();
	const y = stream.getInt16();
	const enabled = stream.getUint16() !== 0;
	const argument = stream.getInt16();

	return { type, x, y, enabled, argument };
};

export const parseHotspots = (stream: InputStream, data: any) => {
	// skip over count
	stream.getUint32();

	do {
		const zoneId = stream.getInt16();
		if (zoneId === -1) {
			break;
		}

		const count = stream.getUint16();
		const hotspots = [];
		for (let i = 0; i < count; i++) {
			hotspots.push(parseHotspot(stream));
		}
		data.zones[zoneId].hotspots = hotspots;
	} while (true);
};
