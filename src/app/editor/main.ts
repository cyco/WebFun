import { AssetManager } from "src/engine";
import initialize from "./initialize";
import Editor from "./editor";

export default async (assets: AssetManager = null): Promise<Editor> => {
	initialize();
	const editor = new Editor();
	await editor.run(assets);

	return editor;
};
