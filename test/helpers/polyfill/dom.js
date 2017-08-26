import { global } from "/std";

const {JSDOM} = require("jsdom");

const documentHTML = "<!doctype html><html><body><div id=\"root\"></div></body></html>";
global.jsdom = new JSDOM(documentHTML);
global.window = global.jsdom.window;
global.document = global.window.document;
global.Element = global.window.Element;
global.Image = global.window.Image;
global.NodeList = global.window.NodeList;
global.KeyEvent = global.window.KeyEvent || {};
