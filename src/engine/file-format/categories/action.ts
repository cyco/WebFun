import { InputStream } from "src/util";
import { assert } from "../error";

const IACT = "IACT";

const parseActionItem = (stream: InputStream) => {
	const opcode = stream.getUint16();
	const args = stream.getInt16Array(5);
	const textLength = stream.getUint16();
	const text = stream.getCharacters(textLength, "iso-8859-2");

	return { opcode, arguments: args, text };
};

const parseCondition = parseActionItem;
const parseInstruction = parseActionItem;

export const parseAction = (stream: InputStream, _: any) => {
	const category = stream.getCharacters(4);
	assert(category === IACT, `Expected to find category ${IACT}.`, stream);
	// ignore size
	stream.getUint32();

	const conditionCount = stream.getUint16();
	const conditions = new Array(conditionCount);
	for (let i = 0; i < conditionCount; i++) {
		conditions[i] = parseCondition(stream);
	}

	const instructionCount = stream.getUint16();
	const instructions = new Array(instructionCount);
	for (let i = 0; i < instructionCount; i++) {
		instructions[i] = parseInstruction(stream);
	}

	return { conditions, instructions };
};

export const parseActions = (stream: InputStream, data: any) => {
	// skip over size
	stream.getUint32();

	do {
		const zoneID = stream.getInt16();
		if (zoneID === -1) break;

		const count = stream.getUint16();
		const actions = new Array(count);
		for (let i = 0; i < count; i++) {
			actions[i] = parseAction(stream, data);
		}

		data.zones[zoneID].actions = actions;
	} while (true);
};

export const parseActionNames = (stream: InputStream, data: any) => {
	// skip over size
	stream.getUint32();

	do {
		const zoneID = stream.getInt16();
		if (zoneID === -1) {
			break;
		}
		const actions = data.zones[zoneID].actions;
		do {
			const actionID = stream.getInt16();
			if (actionID === -1) {
				break;
			}

			actions[actionID].name = stream.getCStringWithLength(0x10, "iso-8859-2");
		} while (true);
	} while (true);
};
