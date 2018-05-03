import ParseError from "./parse-error";
import { InputStream } from "src/util";
import { error, assert } from "../error";

const IACT = "IACT";

const parseActionItem = (stream: InputStream) => {
	let opcode = stream.getUint16();
	let args = stream.getInt16Array(5);
	let textLength = stream.getUint16();
	let text = stream.getCharacters(textLength, "iso-8859-2");

	return { opcode, arguments: args, text };
};

const parseCondition = parseActionItem;
const parseInstruction = parseActionItem;

export const parseAction = (stream: InputStream, data: any) => {
	const category = stream.getCharacters(4);
	assert(category === IACT, `Expected to find category ${IACT}.`, stream);
	let size = stream.getUint32();

	let conditionCount = stream.getUint16();
	const conditions = new Array(conditionCount);
	for (let i = 0; i < conditionCount; i++) {
		conditions[i] = parseCondition(stream);
	}

	let instructionCount = stream.getUint16();
	const instructions = new Array(instructionCount);
	for (let i = 0; i < instructionCount; i++) {
		instructions[i] = parseInstruction(stream);
	}

	return { conditions, instructions };
};

export const parseActions = (stream: InputStream, data: any) => {
	let size = stream.getUint32();
	do {
		let zoneID = stream.getInt16();
		if (zoneID === -1) break;

		let count = stream.getUint16();
		let actions = new Array(count);
		for (let i = 0; i < count; i++) {
			actions[i] = parseAction(stream, data);
		}

		data.zones[zoneID].actions = actions;
	} while (true);
};

export const parseActionNames = (stream: InputStream, data: any) => {
	let size = stream.getUint32();
	do {
		let zoneID = stream.getInt16();
		if (zoneID === -1) {
			break;
		}
		const actions = data.zones[zoneID].actions;
		do {
			let actionID = stream.getInt16();
			if (actionID === -1) {
				break;
			}

			actions[actionID].name = stream.getCStringWithLength(0x10, "iso-8859-2");
		} while (true);
	} while (true);
};
