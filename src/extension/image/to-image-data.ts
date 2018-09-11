const toImageData = function(pixelated: boolean = true) {
	const canvas = document.createElement("canvas");
	canvas.width = this.width;
	canvas.height = this.height;
	canvas.classList.add("pixelated");

	const ctx = canvas.getContext("2d");
	if (pixelated) ctx.imageSmoothingEnabled = false;
	ctx.drawImage(this, 0, 0);
	return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

HTMLImageElement.prototype.toImageData = HTMLImageElement.prototype.toImageData || toImageData;

export default toImageData;
