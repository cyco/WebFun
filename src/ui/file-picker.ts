declare interface FilePickerOptions {
	allowsMultipleFiles?: boolean;
	allowedTypes?: string[];
}

class FilePicker implements FilePickerOptions {
	public allowsMultipleFiles: boolean = false;
	public allowedTypes: string[] = [];

	constructor(options: FilePickerOptions = <FilePickerOptions>{}) {
		if (options.allowsMultipleFiles !== undefined) this.allowsMultipleFiles = options.allowsMultipleFiles;

		if (options.allowedTypes !== undefined) {
			this.allowedTypes = options.allowedTypes;
		}
	}

	static async Pick(options?: FilePickerOptions) {
		const picker = new FilePicker(options);
		return await picker.pickFile();
	}

	async pickFile(): Promise<File[]> {
		return new Promise<File[]>(resolve => {
			const input = document.createElement("input");
			input.type = "file";
			input.style.opacity = "0.0";

			if (this.allowedTypes.length) {
				input.accept = this.allowedTypes
					.map(type => (type.indexOf("/") === -1 ? type : "." + type))
					.join(",");
			}

			if (this.allowsMultipleFiles) {
				input.setAttribute("multiple", "");
			}

			const handler = () => {
				const fileList = input.files;
				const files = Array.from(fileList || []);
				resolve(files);

				input.remove();
				document.body.onfocus = null;
			};
			input.onchange = handler;
			document.body.onfocus = handler;

			document.body.appendChild(input);
			input.click();
		});
	}
}

export default FilePicker;
