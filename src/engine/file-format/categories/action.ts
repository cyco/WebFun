import { InputStream } from "src/util";
import { assert } from "../error";
import { Data, Action } from "../types";

const IACT = "IACT";

const parseActionItem = (stream: InputStream) => {
	const opcode = stream.readUint16();
	const args = stream.readInt16Array(5);
	const textLength = stream.readUint16();
	const text = stream.readCharacters(textLength, "iso-8859-2");

	return { opcode, arguments: args, text };
};

const parseCondition = (stream: InputStream) =>
	Object.assign(parseActionItem(stream), { isCondition: true });
const parseInstruction = (stream: InputStream) =>
	Object.assign(parseActionItem(stream), { isInstruction: true });

export const parseAction = (stream: InputStream, _: Data): Action => {
	const category = stream.readCharacters(4);
	assert(category === IACT, `Expected to find category ${IACT}.`, stream);
	// ignore size
	stream.readUint32();

	const conditionCount = stream.readUint16();
	const conditions = new Array(conditionCount);
	for (let i = 0; i < conditionCount; i++) {
		conditions[i] = parseCondition(stream);
	}

	const instructionCount = stream.readUint16();
	const instructions = new Array(instructionCount);
	for (let i = 0; i < instructionCount; i++) {
		instructions[i] = parseInstruction(stream);
	}

	return { conditions, instructions };
};

export const parseActions = (stream: InputStream, data: Data): void => {
	// skip over size
	stream.readUint32();

	do {
		const zoneID = stream.readInt16();
		if (zoneID === -1) break;

		const count = stream.readUint16();
		const actions = new Array(count);
		for (let i = 0; i < count; i++) {
			actions[i] = parseAction(stream, data);
		}

		data.zones[zoneID].actions = actions;
	} while (true);
};

export const parseActionNames = (stream: InputStream, data: Data): void => {
	// skip over size
	stream.readUint32();

	do {
		const zoneID = stream.readInt16();
		if (zoneID === -1) {
			break;
		}
		const actions = data.zones[zoneID].actions;
		do {
			const actionID = stream.readInt16();
			if (actionID === -1) {
				break;
			}

			actions[actionID].name = stream.readCStringWithLength(0x10, "iso-8859-2");
		} while (true);
	} while (true);
};
