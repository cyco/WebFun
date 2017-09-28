declare interface Node {
	readonly isConnected: boolean;
}

interface Array<T> {
	first(): T|null;
	last(): T|null;
	contains(T:any): boolean
}

interface String {
	padStart(length: number, character: string): string
}

declare interface ObjectConstructor {
	values: (thing: any) => any[];
}
