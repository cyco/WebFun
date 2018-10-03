import { FileReader } from "src/std/dom";

const readAsArrayBuffer = function(): Promise<ArrayBuffer> {
	return new Promise<ArrayBuffer>((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = (e: any) => resolve(e.target.result);
		fileReader.onerror = (e: ErrorEvent) => reject(e.error);
		fileReader.readAsArrayBuffer(this);
	});
};

File.prototype.readAsArrayBuffer = File.prototype.readAsArrayBuffer || readAsArrayBuffer;

declare global {
	interface File {
		readAsArrayBuffer(): Promise<ArrayBuffer>;
	}
}

export default readAsArrayBuffer;
