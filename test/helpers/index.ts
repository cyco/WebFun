import "regenerator-runtime/runtime";
import "jasmine-expect";

import "src/extension";
import { console, global } from "src/std";
import { describeComponent, fdescribeComponent, xdescribeComponent } from "./component";
import "./matchers";
import { buildFixtureUrl, getFixtureData, getFixtureContent } from "./fixture-loading";
import {
	describeMonsterMovement,
	xdescribeMonsterMovement,
	fdescribeMonsterMovement
} from "./gameplay/monster-movement";

import render from "./render";
import { Component, ComponentJSXRenderer } from "src/ui";
import withTimeout from "./with-timeout";

global.render = render;
declare global {
	let require: any;

	type RenderViaClass = <T extends typeof Component & { new (): any }>(
		componentClass: T,
		attributes?: any,
		flags?: string[]
	) => InstanceType<T>;
	type RenderString = (text: string, attributes?: any, flags?: string[]) => HTMLElement;
	type RenderComponent = (text: Component, attributes?: any, flags?: string[]) => Component;

	let render: RenderViaClass & RenderString & RenderComponent;
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

global.WebFun = global.WebFun || {};
global.WebFun.JSX = new ComponentJSXRenderer();

localStorage.clear();

console.assert = (condition: string, message?: string, ...rest: any[]) => {
	if (!condition) {
		let i = 0;
		if (!message) message = "Assertion failed!";
		throw new Error(message.replace(/\{\}/g, (_: any) => rest[i++]));
	}
};

global.describeMonsterMovement = describeMonsterMovement;
global.xdescribeMonsterMovement = xdescribeMonsterMovement;
global.fdescribeMonsterMovement = fdescribeMonsterMovement;

declare global {
	let describeMonsterMovement: describeMonsterMovement;
	let xdescribeMonsterMovement: describeMonsterMovement;
	let fdescribeMonsterMovement: describeMonsterMovement;
}

export {
	getFixtureContent,
	describeMonsterMovement,
	fdescribeMonsterMovement,
	xdescribeMonsterMovement,
	describeComponent,
	xdescribeComponent,
	fdescribeComponent
};
