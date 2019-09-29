import { InputStream } from "src/util";
import { Monster } from "../types";

export const parseMonster = (stream: InputStream): Monster => {
	const character = stream.getUint16();
	const x = stream.getUint16();
	const y = stream.getUint16();
	const loot = stream.getInt16();
	const dropsLoot = !!stream.getUint32();
	const waypoints = stream.getInt32Array(8);

	return { character, x, y, loot, dropsLoot, waypoints };
};
