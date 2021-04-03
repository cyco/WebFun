import { InputStream } from "src/util";
import { Section } from "./portable-executable";
import { ResourceType } from "./resource-type";

type DirectoryEntry = { name: number; offset: number; content: any };
export type Resource = {
	type: ResourceType;
	name?: string;
	nameIdentifier: number;
	langauge: number;
	offset: number;
	size: number;
};

class ResourceSectionParser {
	public parse(section: Section, stream: InputStream): Resource[] {
		stream.seek(section.bodyOffset, InputStream.Seek.Set);
		const directory = this.readDirectory(stream, section.bodyOffset);

		const results: Resource[] = [];
		for (const type of directory.idEntries) {
			// type
			for (const name of type.content.idEntries) {
				// name
				for (const language of name.content.idEntries) {
					// language
					results.push({
						type: type.name,
						nameIdentifier: name.name,
						language: language.name,
						...language.content
					});
				}
			}
		}

		return results;
	}

	private readDirectory(stream: InputStream, base: number) {
		const { numberOfNamedEntries, numberOfIdEntries } = this.readDirectoryHeader(stream);

		const namedEntries: DirectoryEntry[] = [];
		for (let i = 0; i < numberOfNamedEntries; i++) {
			namedEntries.push(this.readImageResourceDirectoryEntry(stream));
		}

		const idEntries: DirectoryEntry[] = [];
		for (let i = 0; i < numberOfIdEntries; i++) {
			idEntries.push(this.readImageResourceDirectoryEntry(stream));
		}

		const offset = stream.offset;

		for (const entry of namedEntries) {
			stream.seek((base + entry.offset) & ~0x80000000, InputStream.Seek.Set);
			if (entry.offset & 0x80000000) {
				entry.content = this.readDirectory(stream, base);
			} else {
				entry.content = this.readDirectoryEntry(stream);
			}
		}

		for (const entry of idEntries) {
			stream.seek((base + entry.offset) & ~0x80000000, InputStream.Seek.Set);
			if (entry.offset & 0x80000000) {
				entry.content = this.readDirectory(stream, base);
			} else {
				entry.content = this.readDirectoryEntry(stream);
			}
		}
		stream.seek(offset, InputStream.Seek.Set);
		return { namedEntries, idEntries };
	}

	private readImageResourceDirectoryEntry(stream: InputStream): DirectoryEntry {
		const name = stream.readUint32();
		const offset = stream.readUint32();

		return { name, offset, content: null };
	}

	private readDirectoryEntry(stream: InputStream) {
		const offset = stream.readUint32();
		const size = stream.readUint32();
		const codePage = stream.readUint32();
		const reserved = stream.readUint32();

		return { offset, size, codePage, reserved };
	}

	private readDirectoryHeader(stream: InputStream) {
		const characteristics = stream.readUint32();
		const timeDateStamp = stream.readUint32();
		const majorVersion = stream.readUint16();
		const minorVersion = stream.readUint16();
		const numberOfNamedEntries = stream.readUint16();
		const numberOfIdEntries = stream.readUint16();

		return {
			characteristics,
			timeDateStamp,
			majorVersion,
			minorVersion,
			numberOfNamedEntries,
			numberOfIdEntries
		};
	}
}

export default ResourceSectionParser;
