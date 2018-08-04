import { ImageData, HTMLImageElement } from "src/std.dom";

async function toImage(pixelated: boolean = true): Promise<HTMLImageElement> {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;
		const ctx = canvas.getContext("2d");
		if (pixelated) ctx.imageSmoothingEnabled = false;
		ctx.putImageData(this, 0, 0);
		const image = document.createElement("img");
		image.onload = () => resolve(image);
		image.onerror = e => reject(e);
		image.src = canvas.toDataURL("image/png");
	});
}

ImageData.prototype.toImage = ImageData.prototype.toImage || toImage;

export default toImage;
