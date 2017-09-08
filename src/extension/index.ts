import * as Array from "./array";
import * as ArrayBuffer from "./array-buffer";
import * as Element from "./element";
import * as Image from "./image";
import * as NodeList from "./node-list";
import * as Number from "./number";
// HACK: can't use Object because it will replace the global Object class during compilation
import * as Object_ from "./object";
import * as Storage from "./storage";
import * as String from "./string";
import * as Uint16Array from "./uint16-array";
import * as Uint8Array from "./uint8-array";
import * as HTMLCollection from "./html-collection";

export {
	Array,
	ArrayBuffer,
	Element,
	Image,
	NodeList,
	Number,
	Object_,
	Storage,
	String,
	Uint16Array,
	Uint8Array,
	HTMLCollection
};
