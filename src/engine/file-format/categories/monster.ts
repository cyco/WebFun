import { InputStream } from "src/util";
import { Monster } from "../types";

export const parseMonster = (stream: InputStream): Monster => {
	const character = stream.readUint16();
	const x = stream.readUint16();
	const y = stream.readUint16();
	const loot = stream.readInt16();
	const dropsLoot = !!stream.readUint32();
	const waypoints = stream.readInt32Array(8);

	return { character, x, y, loot, dropsLoot, waypoints };
};
