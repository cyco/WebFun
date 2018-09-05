import { global } from "./std";

const window = global.window;

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
	MouseEvent
} = global;

export { window };
export const KeyEvent: { [_: string]: number } = global.KeyEvent || {};
export const document = <Document>window.document;
export const localStorage = <Storage>window.localStorage;
