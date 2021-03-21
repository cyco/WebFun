import { InputStream } from "src/util";
import { Yoda, YodaDemo } from "src/variant";
import { Data, Monster } from "../types";

export const parseMonster = (stream: InputStream, data: Data): Monster => {
	if (data.type === Yoda || data.type === YodaDemo) {
		const character = stream.readUint16();
		const x = stream.readUint16();
		const y = stream.readUint16();
		const loot = stream.readInt16();
		const dropsLoot = !!stream.readUint32();
		const waypoints = stream.readInt32Array(8);
		return { character, x, y, loot, dropsLoot, waypoints };
	}

	const character = stream.readUint16();
	const x = stream.readUint16();
	const y = stream.readUint16();
	return { character, x, y, loot: -1, dropsLoot: false, waypoints: new Int16Array() };
};
