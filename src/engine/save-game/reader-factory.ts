import { GameType, Indy, Yoda } from "../type";

import IndyReader from "./indy-reader";
import { InputStream } from "src/util";
import Reader from "./reader";
import YodaReader from "./yoda-reader";
import identify from "./identify";

abstract class ReaderFactory {
	static build(stream: InputStream): { type: GameType; read: Reader["read"] } {
		const type = identify(stream);
		const reader = this.buildReader(type, stream);
		return { type, read: reader.read.bind(reader) };
	}

	protected static buildReader(type: GameType, stream: InputStream) {
		if (type === Indy) {
			return new IndyReader(stream);
		}

		if (type === Yoda) {
			return new YodaReader(stream);
		}

		throw "Invalid game type";
	}
}

export default ReaderFactory;
