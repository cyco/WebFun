import { global } from "./index";

const window = global.window;

if (!global.Storage)
	global.Storage = class {
		get length() {
			return Object.keys(this).length;
		}

		clear(): void {
			Object.keys(this).forEach(k => {
				delete this[k];
			});
		}

		getItem(key: string): string | null {
			return this[key];
		}

		key(index: number): string | null {
			return Object.keys(this)[index];
		}
		removeItem(key: string): void {
			delete this[key];
		}

		setItem(key: string, value: string): void {
			this[key] = value;
		}
		[name: string]: any;
	};

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

export { window };
export const KeyEvent: { [_: string]: number } = global.KeyEvent || {};
export const document = window.document as Document;
export const localStorage = (window.localStorage || new global.Storage()) as Storage;
