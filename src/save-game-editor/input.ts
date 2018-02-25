import { InputStream, Ajax } from "src/util";

class Input {
	public readonly name: string;
	private readonly file: File;
	private readonly url: string;

	constructor(file: File | string, name?: string) {
		this.name = file instanceof File ? file.name : name!;
		this.file = file instanceof File ? file : null;
		this.url = file instanceof File ? null : file;
	}

	public get inputStream(): PromiseLike<InputStream> {
		if (this.file) {
			return this.file.provideInputStream();
		}

		return Ajax.Get(this.url, (p: number) => console.log("progress: ", p));
	}
}

export default Input;
