export default class Size {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		
		Object.seal(this);
	}
	
	toString() {
		return `Size {${this.width}x${this.height}}`;
	}
}

window.Size = Size;