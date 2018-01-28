import { global } from "./std";

const window = global.window;

export const Storage = global.Storage;
export const XMLHttpRequest = global.XMLHttpRequest;
export const Element = global.Element;
export const Image = global.Image;
export const NodeList = global.NodeList;
export const ImageData = global.ImageData;
export const KeyEvent: { [_: string]: number } = global.KeyEvent || {};
export const HTMLElement = global.HTMLElement;
export const HTMLCollection = global.HTMLCollection;
export const Event = global.Event;

export { window };
export const document = <Document>window.document;
export const localStorage = <Storage>window.localStorage;
