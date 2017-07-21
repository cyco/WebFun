export default class FilePicker {
	constructor() {
		this._allowsMultipleFiles = false;
		this._allowedTypes = [];
		this._fileInput = null;
	}

	pickFile() {
		const self = this;
		this._createFileInput();
		this._configureFileInput();

		document.body.onfocus = (e) => self._fileInputChanged(e);
		this._fileInput.onchange = (e) => self._fileInputChanged(e);

		this._fileInput.click();
	}

	_fileInputChanged() {
		document.body.onfocus = undefined;

		const files = Array.from(this._fileInput.files);
		this._fileInput.remove();
		this._fileInput = null;

		const result = this.allowsMultipleFiles ? files : files.last();
		if (this.didPick instanceof Function)
			this.didPick(result);
	}

	_createFileInput() {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.style.opacity = 0.0;

		document.body.appendChild(fileInput);

		this._fileInput = fileInput;
	}

	_configureFileInput() {
		if (this._allowedTypes.length)
			this._fileInput.accept = this._allowedTypes.map(
				(type) => type.indexOf("/") === -1 ? type : "." + type).join(",");

		if (this.allowsMultipleFiles)
			this._fileInput.setAttribute("multiple", "");
	}

	set allowsMultipleFiles(flag) {
		this._allowsMultipleFiles = flag;
	}

	get allowsMultipleFiles() {
		return this._allowsMultipleFiles;
	}

	set allowedTypes(types) {
		this._allowedTypes = types;
	}

	get allowedTypes() {
		return this._allowedTypes;
	}

	set didPick(dp) {
		this._didPick = dp;
	}

	get didPick() {
		return this._didPick;
	}
}
