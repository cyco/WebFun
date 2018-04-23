import ParseError from "./parse-error";
import { InputStream } from "src/util";
import RawData from "./raw-data";
import { error, assert } from "../error";

const IACT = "IACT";

const parseActionItem = (stream: InputStream, data: RawData) => {
	let opcode = stream.getUint16();
	let args = stream.getInt16Array(5);
	let textLength = stream.getUint16();
	// ISO_8859_1
	let text = stream.getCharacters(textLength);
};
const parseCondition = (stream: InputStream, data: RawData) => {
	parseActionItem(stream, data);
};
const parseInstruction = (stream: InputStream, data: RawData) => {
	parseActionItem(stream, data);
};

export const parseAction = (stream: InputStream, data: RawData) => {
	const category = stream.getCharacters(4);
	assert(category === IACT, `Expected to find category ${IACT}.`, stream);
	let size = stream.getUint32();
	let conditionCount = stream.getUint16();
	for (let i = 0; i < conditionCount; i++) {
		parseCondition(stream, data);
	}
	let instructionConunt = stream.getUint16();
	for (let i = 0; i < instructionConunt; i++) {
		parseInstruction(stream, data);
	}
};

export const parseActions = (stream: InputStream, data: RawData) => {
	let size = stream.getUint32();
	do {
		let idx = stream.getInt16();
		if (idx === -1) break;

		let count = stream.getUint16();
		for (let i = 0; i < count; i++) {
			parseAction(stream, data);
		}
	} while (true);
};
export const parseActionNames = (stream: InputStream, data: RawData, error: ParseError) => {};
