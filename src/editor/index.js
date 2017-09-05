import "./index.scss";
import { ComponentRegistry } from "src/ui";
import { OutputStream } from "src/util";
import * as Components from "./components";
import { Window } from "./components";
import * as Editors from "./editors";
import { TileEditor, ZonesEditor } from "./editors";
import WindowMenu from "./menu";
import Writer from "./writer";

export const Type = {
	Zones: "Zones",
	Tiles: "Types"
};

let componentsInitialized = false;
export default class {
	constructor(data) {
		if (!componentsInitialized) {
			ComponentRegistry.sharedRegistry.registerComponents(Components);
			ComponentRegistry.sharedRegistry.registerComponents(Editors);
			componentsInitialized = true;
		}

		this._data = data;
		this._editors = {};
		this._currentEditor = null;
		this._window = document.createElement(Window.TagName);
		this._window.menu = WindowMenu(this);

		this._registerEditors();
	}

	_registerEditors() {
		this._editors[ Type.Zones ] = document.createElement(ZonesEditor.TagName);
		this._editors[ Type.Tiles ] = document.createElement(TileEditor.TagName);

		Object.values(this._editors).forEach(editor => editor.data = this._data);
	}

	show() {
		document.body.appendChild(this._window);
		this.showEditor(Type.Zones);
	}

	save() {
		debugger;
		const writer = new Writer(this._data);
		const stream = new OutputStream(writer.requiredSize);
		writer.writeTo(stream);

		const buffer = stream.buffer;
		const array = new Uint8Array(buffer);
		const base64 = btoa(Array.from(array).map(function (byte) {
			return String.fromCharCode(byte);
		}).join(""));

		const link = "data:" + "application/binary" + ";base64," + base64;
		const uri = encodeURI(link);
		const anchor = document.createElement("a");
		document.body.appendChild(anchor);
		anchor.href = uri;
		anchor.download = "yoda.modified.data";
		anchor.click();
		document.body.removeChild(anchor);
		debugger;
	}

	close() {
		this._window.remove();
	}

	showEditor(type) {
		console.assert(Object.values(Type).contains(type));

		const editor = this._editors[ type ];
		this._window.content.clear();
		this._window.content.appendChild(editor);

		this._currentEditor = type;
	}

	get currentEditor() {
		return this._currentEditor;
	}
}
