import { InputStream } from "src/util";
import { ResourceType } from ".";
import { Section } from "./portable-executable";
import { Resource } from "./resource-section-parser";

class StringResourceParser {
	public parse(
		resource: Resource,
		resourceSection: Section,
		stream: InputStream
	): { [_: number]: string } {
		console.assert(resource.type === ResourceType.RT_STRING);
		console.assert(resourceSection.name === ".rsrc");

		const strings: { [_: number]: string } = {};
		stream.seek(
			resourceSection.bodyOffset + resource.offset - resourceSection.virtualAddress,
			InputStream.Seek.Set
		);

		for (let i = 0; i < 16; i++) {
			const length = stream.readUint16();
			if (length === 0) continue;

			const id = ((resource.nameIdentifier - 1) << 4) | i;
			const string = stream.readCharacters(length * 2, "utf-16le");
			strings[id] = string;
		}

		return strings;
	}
}

export default StringResourceParser;
