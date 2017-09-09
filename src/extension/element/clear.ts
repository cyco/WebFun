const clear = function (): void {
	while (this.firstChild) {
		this.removeChild(this.firstChild);
	}
};

Element.prototype.clear = Element.prototype.clear || clear;

declare global {
	interface Element {
		clear(): void;
	}
}


export default clear;
