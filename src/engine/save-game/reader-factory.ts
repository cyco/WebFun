import { Variant, Indy, Yoda, IndyDemo, YodaDemo } from "../variant";

import IndyReader from "./indy-reader";
import { InputStream } from "src/util";
import Reader from "./reader";
import YodaReader from "./yoda-reader";
import identify from "./identify";

abstract class ReaderFactory {
	static build(stream: InputStream): { type: Variant; read: Reader["read"] } {
		const type = identify(stream);
		const reader = this.buildReader(type, stream);
		return { type, read: reader.read.bind(reader) };
	}

	protected static buildReader(type: Variant, stream: InputStream): IndyReader | YodaReader {
		if (type === Indy || type === IndyDemo) {
			return new IndyReader(stream);
		}

		if (type === Yoda || type === YodaDemo) {
			return new YodaReader(stream);
		}
	}
}

export default ReaderFactory;
