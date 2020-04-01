import { File } from "src/std/dom";
import { InputStream } from "src/util";

const provideInputStream = async function (): Promise<InputStream> {
	const buffer = await this.readAsArrayBuffer();
	return new InputStream(buffer);
};

if (File) File.prototype.provideInputStream = File.prototype.provideInputStream || provideInputStream;

declare global {
	interface File {
		provideInputStream(): Promise<InputStream>;
	}
}

export default provideInputStream;
