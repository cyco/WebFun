const downloadImage = (content: ImageData, filename: string, type: string = "png"): void => {
	const canvas = document.createElement("canvas");
	canvas.width = content.width;
	canvas.height = content.height;
	canvas.getContext("2d").putImageData(content, 0, 0);
	const url = canvas.toDataURL(`image/${type}`);

	const downloadLink = document.createElement("a");
	downloadLink.setAttribute("href", url);
	downloadLink.setAttribute("download", filename);
	downloadLink.click();
};

export default downloadImage;
