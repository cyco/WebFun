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
	has(s: string): boolean;
	load(s: string): any;
	store(s: string, v: any): void;
}

interface RegExpConstructor {
	escape: (_: string) => string;
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
	toImage(): HTMLImageElement;
}

interface Uint8Array {
	findColor(r: number, g: number, b: number, a?: number): number;
	toGIMP(name: string): string;
}

declare interface Component extends HTMLElement {}

declare namespace JSX {
	export interface IntrinsicElements {
		div: Partial<HTMLDivElement>;
		label: Partial<HTMLLabelElement>;
		span: Partial<HTMLSpanElement>;
		input: Partial<HTMLInputElement>;
		canvas: Partial<HTMLCanvasElement>;
		img: Partial<HTMLImageElement>;
		i: Partial<HTMLElement>;
	}

	interface Element extends Component {}
	interface IntrinsicClassAttributes<T> {
		[_: string]: any;
	}
	/*
	interface HtmlElementInstance { }
	interface ElementAttributesProperty { __props: any; }
	interface ElementTypeProperty { __elementType: any; }
	*/
}

// by @ahejlsberg
// As seen on https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
	[x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}
