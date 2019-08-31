import "core-js/stable";
import "regenerator-runtime/runtime";
import "jasmine-expect";

import "src/extension";
import { console, global } from "src/std";
import { describeComponent, fdescribeComponent, xdescribeComponent } from "./component";
import "./matchers";
import { buildFixtureUrl, getFixtureData, getFixtureContent } from "./fixture-loading";
import {
	describeNPCMovement,
	xdescribeNPCMovement,
	fdescribeNPCMovement,
	DescribeNPCMovement
} from "./gameplay/npc-movement";

import render from "./render";
import { Component, ComponentJSXRenderer } from "src/ui";
import withTimeout from "./with-timeout";

global.render = render;
declare global {
	let require: any;
	let render: (
		text: string | Component | typeof Component,
		attributes?: any,
		flags?: string[]
	) => HTMLElement;
}
global.withTimeout = withTimeout;

global.describeComponent = describeComponent;
global.xdescribeComponent = xdescribeComponent;
global.fdescribeComponent = fdescribeComponent;

declare global {
	let describeComponent: Function;
	let xdescribeComponent: Function;
	let fdescribeComponent: Function;
}

global.getFixtureData = getFixtureData;
global.buildFixtureUrl = buildFixtureUrl;

global.WebFunJSX = new ComponentJSXRenderer();

console.assert = (condition: string, message?: string, ...rest: any[]) => {
	if (!condition) {
		let i = 0;
		if (!message) message = "Assertion failed!";
		throw new Error(message.replace(/\{\}/g, (_: any) => rest[i++]));
	}
};

global.describeNPCMovement = describeNPCMovement;
global.xdescribeNPCMovement = xdescribeNPCMovement;
global.fdescribeNPCMovement = fdescribeNPCMovement;

declare global {
	let describeNPCMovement: DescribeNPCMovement;
	let xdescribeNPCMovement: DescribeNPCMovement;
	let fdescribeNPCMovement: DescribeNPCMovement;
}

export { getFixtureContent, describeNPCMovement };
