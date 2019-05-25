import { InputStream } from "src/util";

export const parseNPC = (stream: InputStream) => {
	const character = stream.getUint16();
	const x = stream.getUint16();
	const y = stream.getUint16();
	const loot = stream.getInt16();
	const dropsLoot = !!stream.getUint32();

	const unknown = stream.getUint8Array(0x20);

	return { character, x, y, loot, dropsLoot, unknown };
};
