const clear = function() {
	while (this.firstChild) {
		this.removeChild(this.firstChild);
	}
};

Element.prototype.clear = Element.prototype.clear || clear;
export default clear;
