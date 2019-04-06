declare interface Node {
	readonly isConnected: boolean;
}

interface NodeModule {
	hot: any;
}

interface Array<T> {
	first(): T | null;
	last(): T | null;
	contains(_: T): boolean;
	shuffle(): T[];
}

interface Storage {
	prefixedWith(s: string): Storage;
	has(s: string): boolean;
	load(s: string): any;
	store(s: string, v: any): void;
}

interface RegExpConstructor {
	escape: (_: string) => string;
}

interface Object {
	each<T>(callback: (key: string, value: T) => void): void;
}

interface NodeList {
	indexOf(_: Node): number;
}

interface HTMLCollection {
	indexOf(_: Node): number;
}

interface Image {
	toImageData(): ImageData;
}

interface HTMLImageElement {
	toImageData(): ImageData;
}

interface ImageData {
	toImage(): Promise<HTMLImageElement>;
}

// by @ahejlsberg
// As seen on https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
	[x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}
