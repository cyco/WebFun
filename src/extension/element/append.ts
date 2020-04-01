import { Element } from "src/std/dom";

const append = function (e: Node) {
	this.appendChild(this.ownerDocument.createTextNode(e));
};

if (Element) Element.prototype.append = Element.prototype.append || append;
export default append;
