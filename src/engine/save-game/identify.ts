import { GameType, Indy, Yoda } from "../type";

import { InputStream } from "src/util";

export default (stream: InputStream): GameType => {
	const magic = stream.getCharacters(9);

	if (magic === Yoda.saveGameMagic) return Yoda;
	if (magic === Indy.saveGameMagic) return Indy;

	throw "Invalid save game format";
};
