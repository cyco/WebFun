import "@babel/polyfill";

import "src/extension";
import { global, console } from "src/std";
import { describeComponent, fdescribeComponent, xdescribeComponent } from "./component";
import "./matchers";

import render from "./render";
import { ComponentJSXRenderer } from "src/ui";

global.render = render;

global.describeComponent = describeComponent;
global.xdescribeComponent = xdescribeComponent;
global.fdescribeComponent = fdescribeComponent;

global.WebFunJSX = new ComponentJSXRenderer();

console.assert = (condition, message) => {
	if (!condition) throw message;
};
