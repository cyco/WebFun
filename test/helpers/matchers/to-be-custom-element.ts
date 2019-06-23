import addMatchers from "add-matchers";
import { HTMLElement } from "src/std/dom";

const toBeCustomElement = (thing: any) => thing.prototype instanceof HTMLElement;

addMatchers({
	toBeCustomElement: toBeCustomElement
});

declare global {
	namespace jasmine {
		interface Matchers<T> {
			toBeCustomElement(): boolean;
		}
	}
}
