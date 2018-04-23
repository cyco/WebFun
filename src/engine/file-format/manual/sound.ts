import { InputStream } from "src/util";

export const parseSounds = (stream: InputStream, data: any) => {
	let size = stream.getUint32();
	let count = -stream.getInt16();
	let sounds = new Array(count);
	for (let i = 0; i < count; i++) {
		let size = stream.getUint16();
		let name = stream.getCharacters(size);
		// ISO_8859_1.decode(&buffer, DecoderTrap::Strict);
		sounds[i] = name;
	}
	data.sounds = sounds;
};
