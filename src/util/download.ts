import { dispatch } from "src/util";
import sleep from "./sleep";

const download = (
	content: ArrayBuffer | Uint8ClampedArray | string | Blob | Uint8Array,
	filename: string,
	type: string = "application/octet-stream"
): Promise<void> => {
	if (typeof content === "string") {
		content = new TextEncoder().encode(content);
	}

	const downloadLink = document.createElement("a");
	downloadLink.setAttribute("href", window.URL.createObjectURL(new Blob([content], { type })));
	downloadLink.setAttribute("download", filename);
	downloadLink.click();

	return sleep(0);
};

export default download;
