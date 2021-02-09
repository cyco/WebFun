import { Variant, Indy, Yoda } from "../variant";

import { InputStream } from "src/util";

export default (stream: InputStream): Variant => {
	const magic = stream.readCharacters(9);

	if (magic === Yoda.saveGameMagic) return Yoda;
	if (magic === Indy.saveGameMagic) return Indy;

	return null;
};
