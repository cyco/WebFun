declare interface Node {
	readonly isConnected: boolean;
}

interface Array<T> {
	first(): T | null;
	last(): T | null;
	contains(_: T): boolean;
	shuffle(): T[];
}

interface Storage {
	prefixedWith(s: string): Storage;
}

interface RegExpConstructor {
	escape: (_: string) => string;
}

interface ObjectConstructor {
	values: (thing: any) => any[];
}

interface Object {
	each<T>(callback: ((key: string, value: T) => void)): void;
}

interface Document {
	addEventListener(
		event: "mouseup",
		listener: (event: MouseEvent) => void,
		options?: {
			passive?: boolean;
			once?: boolean;
			capture?: boolean;
		}
	): void;
}

// by @ahejlsberg
// As seen on https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
	[x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}
