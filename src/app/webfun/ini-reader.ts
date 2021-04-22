import { InputStream } from "src/util";

export type IniFile = {
	[_: string]: string;
};

export type IniReaderOptions = {
	caseSensitiveKeys: boolean;
	caseNormalizationStrategy: (str: string) => string;
	encoding: "utf-8";
	lineSeparator: string;
	commentChar: string;
	sectionNameDelimiters: string;
};

export const IniReaderDefaultOptions: IniReaderOptions = {
	caseSensitiveKeys: false,
	caseNormalizationStrategy: str => str.toLowerCase(),
	encoding: "utf-8",
	lineSeparator: "\r\n",
	commentChar: ";",
	sectionNameDelimiters: "[]"
};

class IniReader {
	private readonly options: IniReaderOptions;
	constructor(options: Partial<IniReaderOptions> = {}) {
		this.options = Object.assign({}, IniReaderDefaultOptions, options);
	}

	public read(stream: InputStream): IniFile {
		const string = stream.readCharacters(stream.length, this.options.encoding);
		return this.readFromString(string);
	}

	public readFromString(string: string): IniFile {
		let result: IniFile = {};
		if (!this.options.caseSensitiveKeys) {
			result = this.makeCaseInensitive(result);
		}

		const lines = string.split(this.options.lineSeparator);
		let currentSection: string = null;
		for (let line of lines) {
			const startOfComment = line.indexOf(this.options.commentChar);
			if (startOfComment !== -1) {
				line = line.substr(0, startOfComment);
			}
			line = line.trim();
			if (line.length === 0) continue;
			if (line.length < 2) continue;

			if (
				line[0] === this.options.sectionNameDelimiters[0] &&
				line[line.length - 1] === this.options.sectionNameDelimiters[1]
			) {
				currentSection = line.substring(1, line.length - 1);
				continue;
			}

			const [key, ...valueParts] = line.split("=");
			result[currentSection ? `${currentSection}.${key}` : `${key}`] = valueParts.join("=");
		}

		return result;
	}

	private makeCaseInensitive<T>(result: T): T {
		const strat = this.options.caseNormalizationStrategy;

		return new Proxy(result as any, {
			set(target: any, prop, value) {
				if (typeof prop === "string") prop = strat(prop);
				target[prop] = value;
				return true;
			},

			get(target: any, prop) {
				if (typeof prop === "string") prop = strat(prop);
				return target[prop];
			}
		});
	}
}

export default IniReader;
