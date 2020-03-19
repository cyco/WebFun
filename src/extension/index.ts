import * as Array from "./array";
import * as ArrayBuffer from "./array-buffer";
import * as Element from "./element";
import * as File from "./file";
import * as HTMLCollection from "./html-collection";
import * as HTMLSelectElement from "./html-select-element";
import * as HTMLImageElement from "./html-image-element";
import * as Image from "./image";
import * as ImageData from "./image-data";
import * as MouseEvent from "./mouse-event";
import * as NodeList from "./node-list";
import * as Number from "./number";
// HACK: can't use Object because it will replace the global Object class during compilation
import * as Object_ from "./object";
import * as RegExp from "./regexp";
import * as Set from "./set";
import * as Storage from "./storage";
import * as String from "./string";
import * as Uint32Array from "./uint32-array";
import * as Uint16Array from "./uint16-array";
import * as Uint8Array from "./uint8-array";
import * as Int32Array from "./int32-array";
import * as Int16Array from "./int16-array";
import * as Int8Array from "./int8-array";

export {
	Array,
	ArrayBuffer,
	Element,
	File,
	HTMLCollection,
	HTMLImageElement,
	HTMLSelectElement,
	Image,
	ImageData,
	Int16Array,
	Int32Array,
	Int8Array,
	MouseEvent,
	NodeList,
	Number,
	Object_,
	RegExp,
	Set,
	Storage,
	String,
	Uint16Array,
	Uint32Array,
	Uint8Array
};
