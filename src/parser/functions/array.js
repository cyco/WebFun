import { character } from "../types";
import _evalLength from './eval-length';

export default (type, length) => {
	if (type === character) {
		return (stream, r) => stream.getCharacters(_evalLength(stream, length, r));
	}

	return (stream, r) => _evalLength(stream, length, r).times(() => type(stream, r));
};