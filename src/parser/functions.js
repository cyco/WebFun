import { uint8, uint16, uint32, character } from "./types";

export const structure = (definition) => {
	return (stream) => {
		const result = {};
		definition.each((key, reader) => {
			result[key] = reader(stream, result);
		});
		return result;
	};
};

const _evalLength = (stream, length, result) => {
	let r;
	if (length instanceof Function)
		r = length(stream, result);
	else if (typeof length === "string")
		r = result[length];
	else
		r = length;
	return r;
};

export const array = (type, length) => {
	if (type === character) {
		return (stream, r) => stream.getCharacters(_evalLength(stream, length, r));
	}

	return (stream, r) => _evalLength(stream, length, r).times(() => type(stream, r));
};

export const blob = (type, length) => {
	switch (type) {
		case uint8:
			return (stream, r) => stream.getUint8Array(_evalLength(stream, length, r));
		case uint16:
			return (stream, r) => stream.getUint16Array(_evalLength(stream, length, r));
		case uint32:
			return (stream, r) => stream.getUint32Array(_evalLength(stream, length, r));
		case character:
			return (stream, r) => stream.getCharacters(_evalLength(stream, length, r));
	}
};

export const until = (index, end, type) => {
	return (stream) => {
		const result = [];
		let idx;
		while ((idx = index(stream, result)) !== end) {
			result[idx] = type(stream, result);
		}
		return result;
	};
};

export const loopedSwitch = (type, options) => {
	const end = Object.keys(options).last();
	return (stream) => {
		const result = {};
		let key = null;
		do {
			key = type(stream, result);
			if (!(options[key] instanceof Function)) {
				console.warn(`Unknown category ${key}!`);
			}
			result[key] = options[key](stream);
		} while (key !== end);

		return result;
	};
};
