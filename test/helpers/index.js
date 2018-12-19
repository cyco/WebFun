import "@babel/polyfill";

import "src/extension";
import { global, console } from "src/std";
import { describeComponent, fdescribeComponent, xdescribeComponent } from "./component";
import "./matchers";
import { getFixtureData, buildFixtureUrl } from "./fixture-loading";

import render from "./render";
import { ComponentJSXRenderer } from "src/ui";

global.render = render;

global.describeComponent = describeComponent;
global.xdescribeComponent = xdescribeComponent;
global.fdescribeComponent = fdescribeComponent;

global.getFixtureData = getFixtureData;
global.buildFixtureUrl = buildFixtureUrl;

global.WebFunJSX = new ComponentJSXRenderer();

console.assert = (condition, message) => {
	if (!condition) throw message;
};
