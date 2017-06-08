import 'src/extension';
import './matchers';

import { describeComponent, xdescribeComponent, fdescribeComponent } from './component';
import { describeInstruction, xdescribeInstruction, fdescribeInstruction, 
		 describeCondition, xdescribeCondition, fdescribeCondition } from './script';
import render from './render';
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
