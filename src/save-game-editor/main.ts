import "@babel/polyfill";
import "../extension";
import "../_style/global.scss";
import "./styles.scss";

import { ComponentRegistry } from "src/ui";
import * as Components from "src/ui/components";
import * as SaveGameEditorComponents from "./components";
import * as EditorComponents from "../editor/components";
import { DataManager } from "src/editor";
import { GameData, ColorPalette } from "src/engine";
import SaveGameEditor from "./save-game-editor";
import { InputStream, Ajax } from "src/util";
import { XMLHttpRequest } from "src/std.dom";
import { WindowManager } from "src/ui";
import Input from "./input";

const SampleFiles = [
	"save-games/sample-1.wld",
	"save-games/sample-2.wld",
	"save-games/sample-3.wld"
];

const useSample = async (idx: number) => {
	try {
		console.log("use sample", idx, SampleFiles[idx]);
		const input = new Input(SampleFiles[idx], SampleFiles[idx].split("/").last());
		const result = await input.inputStream;
		console.log("done", result);
	} catch (e) {
		console.warn(e);
	}
};

const useArchiveOrgGameData = async () => {
	try {
		console.log("use archive.org gmae data");
		const url = "";
		const ajax = new Ajax();
		ajax.method = "GET";
		ajax.url =
			"https://cors.archive.org/compress/Star_Wars_-_Yoda_Stories_1997_LucasArts/Star%20Wars%20-%20Yoda%20Stories%20%281997%29%28LucasArts%29.iso";
		ajax.setRequestHeader("Range", "bytes=502538240-507140230");
		console.log("start", performance.now());
		ajax.onprogress = (p: number) => console.log("p", p);
		const result = await ajax.send();
		console.log("done", result);
		console.log("end", performance.now());
	} catch (e) {
		console.warn(e);
	}
};

const main = () => {
	ComponentRegistry.sharedRegistry.registerComponents(<any>Components);
	ComponentRegistry.sharedRegistry.registerComponents(<any>EditorComponents);
	ComponentRegistry.sharedRegistry.registerComponents(<any>SaveGameEditorComponents);

	["sample-1", "sample-2", "sample-3"]
		.map(i => document.getElementById(i))
		.forEach((btn, idx) => (btn.onclick = () => useSample(idx)));
	document.getElementById("game-data-archive").onclick = () => useArchiveOrgGameData();
};

window.addEventListener("load", main, { once: true } as any);
