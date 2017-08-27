export default class Size {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		Object.seal(this);
	}

	get area() {
		return this.width * this.height;
	}

	toString() {
		return `Size {${this.width}x${this.height}}`;
	}
}
