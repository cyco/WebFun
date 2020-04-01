import { File } from "src/std/dom";
import { FileReader } from "src/std/dom";

const readAsText = function (): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = (e: any) => resolve(e.target.result);
		fileReader.onerror = (e: ErrorEvent) => reject(e.error);
		fileReader.readAsText(this);
	});
};

File.prototype.readAsText = File.prototype.readAsText || readAsText;

declare global {
	interface File {
		readAsText(): Promise<string>;
	}
}

export default readAsText;
