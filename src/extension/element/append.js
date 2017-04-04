const append = function(e) {
	this.appendChild(this.ownerDocument.createTextNode(e));
};

Element.prototype.append = Element.prototype.append || append;
export default append;
