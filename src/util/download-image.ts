import sleep from "./sleep";

const downloadImage = async (content: ImageData, filename: string, type: string = "png"): Promise<void> => {
	if (!content) return;

	const canvas = document.createElement("canvas");
	canvas.width = content.width;
	canvas.height = content.height;
	canvas.getContext("2d").putImageData(content, 0, 0);
	const url = canvas.toDataURL(`image/${type}`);

	const downloadLink = document.createElement("a");
	downloadLink.setAttribute("href", url);
	downloadLink.setAttribute("download", filename);
	downloadLink.click();

	return await sleep(0);
};

export default downloadImage;
