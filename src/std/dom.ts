import { global } from "./index";

export const {
	CustomEvent,
	Element,
	Event,
	File,
	FileReader,
	HTMLCollection,
	HTMLElement,
	HTMLImageElement,
	HTMLSelectElement,
	Image,
	ImageData,
	MouseEvent,
	Node,
	NodeList,
	Storage,
	XMLHttpRequest
} = global;

export const document = global.document as Document;
export const window = global.window;
export const localStorage = (window.localStorage || new global.Storage()) as Storage;
