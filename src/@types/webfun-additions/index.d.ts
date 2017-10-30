declare interface Node {
	readonly isConnected: boolean;
}

interface Array<T> {
	first(): T|null;

	last(): T|null;

	contains(_: T): boolean

	shuffle(): T[];
}

interface String {
	dasherize: () => string;

	padStart(length: number, character?: string): string
	padEnd(length: number, character?: string): string
}

declare interface ObjectConstructor {
	values: (thing: any) => any[];
}

declare interface Object {
	each<T>(callback: ((key: string, value: T) => void)): void
}


// by @ahejlsberg
// As seen on https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
type JSONValue = string|number|boolean|JSONObject|JSONArray;

interface JSONObject {
	[x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {
}
