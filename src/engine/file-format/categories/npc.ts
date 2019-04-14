import { InputStream } from "src/util";

export const parseNPC = (stream: InputStream) => {
	const character = stream.getUint16();
	const x = stream.getUint16();
	const y = stream.getUint16();
	const unknown1 = stream.getUint16();
	const unknown2 = stream.getUint32();

	const unknown = stream.getUint8Array(0x20);

	return { character, x, y, unknown1, unknown2, unknown };
};
