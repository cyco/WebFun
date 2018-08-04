const toImageData = function() {
	const canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;

	const ctx = canvas.getContext("2d");
	ctx.drawImage(this, 0, 0);
	return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

HTMLImageElement.prototype.toImageData = HTMLImageElement.prototype.toImageData || toImageData;
Image.prototype.toImageData = Image.prototype.toImageData || toImageData;

export default toImageData;
