import { Image } from "src/std.dom";

const readAsImage = async function(): Promise<Image> {
	const buffer = await this.readAsArrayBuffer();

	return new Promise<Image>(async (resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = (e: any) => reject(e);
		image.src = window.URL.createObjectURL(new Blob([buffer]));
	});
};

File.prototype.readAsImage = File.prototype.readAsImage || readAsImage;

declare global {
	interface File {
		readAsImage(): Promise<Image>;
	}
}

export default readAsImage;
