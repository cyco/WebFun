import "@babel/polyfill";

import "src/extension";
import { console, global } from "src/std";
import { describeComponent, fdescribeComponent, xdescribeComponent } from "./component";
import "./matchers";
import { buildFixtureUrl, getFixtureData, getFixtureContent } from "./fixture-loading";

import render from "./render";
import { ComponentJSXRenderer } from "src/ui";
import withTimeout from "./with-timeout";

global.render = render;

global.withTimeout = withTimeout;

global.describeComponent = describeComponent;
global.xdescribeComponent = xdescribeComponent;
global.fdescribeComponent = fdescribeComponent;

global.getFixtureData = getFixtureData;
global.buildFixtureUrl = buildFixtureUrl;

global.WebFunJSX = new ComponentJSXRenderer();

console.assert = (condition, message, ...rest) => {
	if (!condition) {
		let i = 0;
		throw new Error(message.replace(/\{\}/g, _ => rest[i++]));
	}
};

export { getFixtureContent };
