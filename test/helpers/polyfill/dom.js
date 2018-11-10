import { global } from "std";

// const { JSDOM } = require("jsdom");

// const documentHTML = '<!doctype html><html><body><div id="root"></div></body></html>';
// global.jsdom = new JSDOM(documentHTML);
// global.window = global.jsdom.window;
// global.document = global.window.document;
// global.Element = global.window.Element;
global.Event = function() {};
global.Element = function() {};
global.HTMLCollection = function() {};
global.HTMLElement = function() {};
global.Image = function() {};
global.HTMLImageElement = function() {};
global.NodeList = function() {};
global.KeyEvent = function() {};
global.MouseEvent = function() {};
global.File = function() {};
global.HTMLSelectElement = function() {};
