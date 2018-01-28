const download = (content: ArrayBuffer, filename: string, type: string = "application/octet-stream") => {
	const decoder = new (<any>window).TextDecoder("ascii");

	const downloadLink = document.createElement("a");
	downloadLink.setAttribute("href", window.URL.createObjectURL(new Blob([content], { type })));
	downloadLink.setAttribute("download", filename);
	downloadLink.click();
};

export default download;
