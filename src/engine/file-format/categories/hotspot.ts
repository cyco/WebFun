import { InputStream } from "src/util";
import { Data, Hotspot } from "../types";

export const parseHotspot = (stream: InputStream): Hotspot => {
	const type = stream.readUint32();
	const x = stream.readInt16();
	const y = stream.readInt16();
	const enabled = stream.readUint16() !== 0;
	const argument = stream.readInt16();

	return { type, x, y, enabled, argument };
};

export const parseHotspots = (stream: InputStream, data: Data): void => {
	// skip over count
	stream.readUint32();

	do {
		const zoneId = stream.readInt16();
		if (zoneId === -1) {
			break;
		}

		const count = stream.readUint16();
		const hotspots = [];
		for (let i = 0; i < count; i++) {
			hotspots.push(parseHotspot(stream));
		}
		data.zones[zoneId].hotspots = hotspots;
	} while (true);
};
