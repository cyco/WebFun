import { document } from "src/std/dom";

class GlobalFileDrop implements EventListenerObject {
	private static _defaultHandler: GlobalFileDrop;
	private _root: Element;
	private _handlers: { [type: string]: (file: File) => void } = {};
	private preview: HTMLElement = (
		<div
			style={{
				visibility: "hidden",
				top: "0px",
				left: "0px",
				bottom: "0px",
				right: "0px",
				position: "fixed",
				border: "1px solid yellow",
				zIndex: "100000"
			}}
		/>
	);

	public static get defaultHandler(): GlobalFileDrop {
		return (this._defaultHandler = this._defaultHandler || new GlobalFileDrop(document.body));
	}

	private constructor(root: Element) {
		this._root = root;
		this._root.appendChild(this.preview);

		window.addEventListener("dragenter", this);
		window.addEventListener("dragleave", this);
		window.addEventListener("dragover", this);
		window.addEventListener("drop", this);
	}

	public addHandler(type: string, onDrop: (file: File) => void): void {
		this._handlers[type.toLowerCase()] = onDrop;
	}

	public handleEvent(event: DragEvent): void {
		if (event.type === "dragenter") {
			this.preview.style.visibility = "visible";
		}

		if (event.target !== this.preview) {
			return;
		}

		if (event.type === "dragleave") {
			this.preview.style.visibility = "hidden";
		}

		if (event.type === "drop") {
			const files = Array.from(event.dataTransfer.files);
			let acceptedSomething = false;
			for (const file of files) {
				const ext = file.name.split(".").last().toLowerCase();
				const handler = this._handlers[ext];
				if (handler) {
					acceptedSomething = true;
					try {
						handler(file);
					} catch (e) {
						console.error("FileHandler failed with error", e);
					}
				}
			}

			this.preview.style.visibility = "hidden";

			if (!acceptedSomething) {
				return;
			}
		}

		event.dataTransfer.dropEffect = "copy";
		event.preventDefault();
		event.stopPropagation();
	}

	public removeHandler(type: string): void {
		delete this._handlers[type];
	}

	public uninstall(): void {
		this.preview.style.visibility = "hidden";

		window.removeEventListener("dragenter", this);
		window.removeEventListener("dragleave", this);
		window.removeEventListener("dragover", this);
		window.removeEventListener("drop", this);

		this._root = null;
	}
}

export default GlobalFileDrop;
