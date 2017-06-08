import { uint8, uint16, uint32, character } from "../types";
import _evalLength from './eval-length';

export default (type, length) => {
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
