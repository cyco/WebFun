import "../helpers/index.js";

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

var testsContext = require.context("../unit/", true, /\.test.(js|ts)$/);
testsContext.keys().forEach(testsContext);
