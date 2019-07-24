import { global } from "./index";

export const {
	Storage,
	XMLHttpRequest,
	Element,
	Image,
	NodeList,
	Node,
	ImageData,
	HTMLElement,
	HTMLCollection,
	HTMLImageElement,
	HTMLSelectElement,
	Event,
	File,
	FileReader,
	MouseEvent,
	CustomEvent
} = global;

export const KeyEvent: { [_: string]: number } = global.KeyEvent || {};
export const document = global.document as Document;
export const window = global.window;
export const localStorage = (window.localStorage || new global.Storage()) as Storage;
