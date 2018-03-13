import "@babel/polyfill";

import "src/extension";
import { global, console } from "src/std";

import { describeComponent, fdescribeComponent, xdescribeComponent } from "./component";
import "./matchers";
import render from "./render";

global.render = render;

global.describeComponent = describeComponent;
global.xdescribeComponent = xdescribeComponent;
global.fdescribeComponent = fdescribeComponent;

console.assert = (condition, message) => {
	if (!condition) throw message;
};
