import { InputStream } from "src/util";
import { assert } from "../error";

export const parseSounds = (stream: InputStream, data: any) => {
	let size = stream.getUint32();
	let count = -stream.getInt16();
	let sounds = new Array(count);
	for (let i = 0; i < count; i++) {
		let size = stream.getUint16();
		assert(size > 0, `Expected at least as null byte to terminate an empty string!`, stream);
		const name = stream.getCharacters(size - 1);
		const stringTerminator = stream.getUint8();
		assert(stringTerminator === 0, `Expected string to be null terminated!`, stream);
		sounds[i] = name;
	}
	data.sounds = sounds;
};
