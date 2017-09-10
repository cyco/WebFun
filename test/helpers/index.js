import "babel-polyfill";

import "src/extension";
import "./matchers";
import { describeComponent, fdescribeComponent, xdescribeComponent } from "./component";
import {
	describeCondition,
	describeInstruction,
	fdescribeCondition,
	fdescribeInstruction,
	xdescribeCondition,
	xdescribeInstruction
} from "./script";
import render from "./render";

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
