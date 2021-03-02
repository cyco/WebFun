import "../helpers/index.ts";

import { global } from "src/std";
import {
	describeCondition,
	describeInstruction,
	fdescribeCondition,
	fdescribeInstruction,
	xdescribeCondition,
	xdescribeInstruction
} from "../helpers/script";

global.describeCondition = describeCondition;
global.xdescribeCondition = xdescribeCondition;
global.fdescribeCondition = fdescribeCondition;

global.describeInstruction = describeInstruction;
global.xdescribeInstruction = xdescribeInstruction;
global.fdescribeInstruction = fdescribeInstruction;

import "src/app/webfun/windows";

const testsContext = require.context("../unit/", true, /\.test\.tsx?$/);
testsContext.keys().forEach(testsContext);
