import '/extension';
import '/util';

import { jsdom } from 'jsdom';

const documentHTML = '<!doctype html><html><body><div id="root"></div></body></html>';
global.doc = jsdom(documentHTML);
global.window = document.parentWindow;
