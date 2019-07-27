import { InputStream } from "src/util";
import { NPC } from "../types";

export const parseNPC = (stream: InputStream): NPC => {
	const character = stream.getUint16();
	const x = stream.getUint16();
	const y = stream.getUint16();
	const loot = stream.getInt16();
	const dropsLoot = !!stream.getUint32();
	const patrolPath = stream.getInt32Array(8);

	return { character, x, y, loot, dropsLoot, patrolPath };
};
