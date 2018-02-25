import "@babel/polyfill";

import "src/extension";
import { console } from "src/std";
import { describeComponent, fdescribeComponent, xdescribeComponent } from "./component";
import "./matchers";
import render from "./render";
import {
	describeCondition,
	describeInstruction,
	fdescribeCondition,
	fdescribeInstruction,
	xdescribeCondition,
	xdescribeInstruction
} from "./script";

global.render = render;

global.describeComponent = describeComponent;
global.xdescribeComponent = xdescribeComponent;
global.fdescribeComponent = fdescribeComponent;

global.describeCondition = describeCondition;
global.xdescribeCondition = xdescribeCondition;
global.fdescribeCondition = fdescribeCondition;

global.describeInstruction = describeInstruction;
global.xdescribeInstruction = xdescribeInstruction;
global.fdescribeInstruction = fdescribeInstruction;

console.assert = (condition, message) => {
	if (!condition) throw message;
};
