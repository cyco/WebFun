import addMatchers from "add-matchers";
import { HTMLElement } from "std/dom";

const toBeCustomElement = thing => {
	return thing.prototype instanceof HTMLElement;
};

addMatchers({
	toBeCustomElement: toBeCustomElement
});
