const {JSDOM} = require("jsdom");

const documentHTML = '<!doctype html><html><body><div id="root"></div></body></html>';
global.doc = new JSDOM(documentHTML);
global.window = global.doc.defaultView;
global.document = global.window.document;
global.Element = global.window.Element;
global.Image = global.window.Image;
global.NodeList = global.window.NodeList;
global.KeyEvent = global.window.KeyEvent || {};
